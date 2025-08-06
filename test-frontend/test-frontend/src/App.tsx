import { useEffect, useState } from "react";
import axios from "axios";
import { type TodoItem } from "./types";
import dayjs from "dayjs";
import TaskList from "./components/TaskList";
import Header from "./components/Header";
import { AnimatePresence } from "motion/react";
import CreateTask from "./components/CreateTask";
import SideBar from "./components/SideBar";

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<"ADD" | "EDIT">("ADD");
  const [curTodoId, setCurTodoId] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [inputDate, setInputDate] = useState("");
  const [inputTime, setInputTime] = useState("");
  const [editText, setEditText] = useState("");

  async function fetchData() {
    const res = await axios.get<TodoItem[]>("api/todo");
    setTodos(res.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputText(e.target.value);
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("date changed to ", e.target.value);
    setInputDate(e.target.value);
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("time changed to ", e.target.value);
    setInputTime(e.target.value);
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEditText(e.target.value);
  }

  function handleSubmit() {
    if (!inputText) return;
    const datetime =
      inputDate && inputTime
        ? dayjs(`${inputDate}T${inputTime}`).toISOString()
        : new Date().toISOString();

    axios
      .put("/api/todo", {
        todoText: inputText,
        createdAt: datetime,
        scheduledDate: inputDate || null,
        scheduledTime: inputTime || null,
      })
      .then(() => {
        setInputText("");
        setInputDate("");
        setInputTime("");
        setOpenModal(false);
        fetchData();
      })
      .catch((err) => alert(err));
  }

  function handleDelete(id: string) {
    axios
      .delete("/api/todo", { data: { id } })
      .then(fetchData)
      .then(() => {
        setMode("ADD");
        setInputText("");
      })
      .catch((err) => alert(err));
  }

  function handleCancel() {
    setMode("ADD");
    setInputText("");
    setCurTodoId("");
    setInputDate("");
    setInputTime("");
  }

  const handleEditSubmit = () => {
    if (!editText) return;

    // const datetime =
    //   inputDate && inputTime
    //     ? dayjs(`${inputDate}T${inputTime}`).toISOString()
    //     : new Date().toISOString();

    axios
      .request({
        url: "/api/todo",
        method: "patch",
        data: {
          id: curTodoId,
          todoText: editText,
          scheduledDate: inputDate || null,
          scheduledTime: inputTime || null,
        },
      })
      .then(() => {
        setEditText("");
        setInputDate("");
        setInputTime("");
        setMode("ADD");
        setCurTodoId("");
        setOpenModal(false);
      })
      .then(fetchData)
      .catch((err) => alert(err));
  };

  const handleEditCancel = () => {
    setEditText("");

    setCurTodoId("");
    setInputDate("");
    setInputTime("");
    setMode("ADD");
    setOpenModal(false);
  };

  const handleEdit = (
    id: string,
    text: string,
    scheduledDate: string,
    scheduledTime: string
  ) => {
    setMode("EDIT");
    setCurTodoId(id);
    setEditText(text);
    // setInputText(text);
    //const dt = dayjs(createdAt);
    setInputDate(scheduledDate);
    setInputTime(scheduledTime);
  };
  useEffect(() => {
    console.log("Current date/time state:", {
      inputDate,
      inputTime,
    });
  }, [inputDate, inputTime]);
  const handleToggleDone = async (id: string, newValue: boolean) => {
    try {
      await axios.patch("/api/todo", {
        id,
        isDone: newValue,
      });
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, isDone: newValue, updatedAt: new Date().toISOString() }
            : t
        )
      );
    } catch (error) {
      console.error("Failed to toggle isDone ", error);
      alert("Can't update isDone status.");
    }
  };

  return (
    
      <div className="min-h-screen pl-8 flex bg-[#f9f9fb]">
        {/* Left (Content area) */}
        <div className="flex-1 container  px-4 md:px-8 max-w-[1200px] mx-auto py-6">
          {/* <h1 className="text-2xl font-extrabold mb-2 text-[#534895]">Todo App</h1> */}

          <AnimatePresence>
            {openModal && (
              <CreateTask
                onClose={() => setOpenModal(false)}
                inputText={mode === "ADD" ? inputText : editText}
                mode={mode}
                onChange={mode === "ADD" ? handleChange : handleEditChange}
                onSubmit={mode === "ADD" ? handleSubmit : handleEditSubmit}
                onCancel={mode === "ADD" ? handleEditCancel : handleCancel}
                inputDate={inputDate}
                inputTime={inputTime}
                onDateChange={handleDateChange}
                onTimeChange={handleTimeChange}
              />
            )}
          </AnimatePresence>
          <div className="">
            <Header todos={todos} setOpenModal={setOpenModal} />
          </div>

          <div className="text-2xl font-[Montserrat] font-extrabold pt-3 pb-3 text-[#756AB6]">
            My Tasks
          </div>

          <TaskList
            todos={todos}
            currentEdittingID={curTodoId}
            editText={editText}
            inputDate={inputDate}
            inputTime={inputTime}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleDone={handleToggleDone}
            onEditChange={handleEditChange}
            onEditSubmit={handleEditSubmit}
            onEditCancel={handleEditCancel}
            onDateChange={handleDateChange}
            onTimeChange={handleTimeChange}
          />
        </div>

        {/* Right (Sidebar) */}
        <div className="hidden lg:block w-[380px] min-h-screen ">
          <div className="p-6">
            <SideBar />
          </div>
        </div>
      </div>
  );
}

export default App;
