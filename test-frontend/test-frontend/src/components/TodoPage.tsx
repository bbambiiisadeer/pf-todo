import axios from "axios";
import { type Owner, type TodoItem } from "../types"; 
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const TodoPage = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<"ADD" | "EDIT">("ADD");
  const [curTodoId, setCurTodoId] = useState("");
  const [owner, setOwner] = useState<Owner | null>(null);

  async function fetchData() {
    const res = await axios.get<TodoItem[]>("api/todo");
    setTodos(res.data);
  }

   async function fetchOwner() {
    const res = await axios.get("api/todo/owner");
    setOwner(res.data);
  }

  useEffect(() => {
    fetchData();
    fetchOwner();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputText(e.target.value);
  }

  function handleSubmit() {
    if (!inputText) return;
    if (mode === "ADD") {
      axios
        .request({
          url: "/api/todo",
          method: "put",
          data: { todoText: inputText },
        })
        .then(() => {
          setInputText("");
        })
        .then(fetchData)
        .catch((err) => alert(err));
    } else {
      axios
        .request({
          url: "/api/todo",
          method: "patch",
          data: { id: curTodoId, todoText: inputText },
        })
        .then(() => {
          setInputText("");
          setMode("ADD");
          setCurTodoId("");
        })
        .then(fetchData)
        .catch((err) => alert(err));
    }
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
  }
   return (
      <div className="container">
        <header>
          <h1 className="text-2xl font-extrabold p-2 mb-2">Todo App</h1>
        </header>
  
        {/* Info */}
        <div className="bg-white shadow-md rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">Name:</span>
            <span className="text-gray-800">{owner?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">ID:</span>
            <span className="text-gray-800">{owner?.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">Course ID:</span>
            <span className="text-gray-800">{owner?.course_id}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">Section:</span>
            <span className="text-gray-800">{owner?.section}</span>
          </div>
        </div>
  
        <main className="pico">
          <div style={{ display: "flex", alignItems: "start" }}>
            <input
              type="text"
              onChange={handleChange}
              value={inputText}
              data-cy="input-text"
            />
            <button onClick={handleSubmit} data-cy="submit">
              {mode === "ADD" ? "Submit" : "Update"}
            </button>
            {mode === "EDIT" && (
              <button onClick={handleCancel} className="secondary">
                Cancel
              </button>
            )}
          </div>
  
          {/* TaskList + Item */}
          <div data-cy="todo-item-wrapper">
            {todos.sort(compareDate).map((item, idx) => {
              const { date, time } = formatDateTime(item.createdAt);
              const text = item.todoText;
              return (
                <article
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                  }}
                >
                  <div>({idx + 1})</div>
                  <div>📅{date}</div>
                  <div>⏰{time}</div>
                  <div data-cy="todo-item-text">📰{text}</div>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setMode("EDIT");
                      setCurTodoId(item.id);
                      setInputText(item.todoText);
                    }}
                    data-cy="todo-item-update"
                  >
                    {curTodoId !== item.id ? "🖊️" : "✍🏻"}
                  </div>
  
                  {mode === "ADD" && (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(item.id)}
                      data-cy="todo-item-delete"
                    >
                      🗑️
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </main>
      </div>
    );
  }
  
  export default TodoPage;
  
  function formatDateTime(dateStr: string) {
    if (!dayjs(dateStr).isValid()) {
      return { date: "N/A", time: "N/A" };
    }
    const dt = dayjs(dateStr);
    const date = dt.format("D/MM/YY");
    const time = dt.format("HH:mm");
    return { date, time };
  }
  
  function compareDate(a: TodoItem, b: TodoItem) {
    const da = dayjs(a.createdAt);
    const db = dayjs(b.createdAt);
    return da.isBefore(db) ? -1 : 1;
  }
  