import React from "react";
import type { TodoItem } from "../types";
import { AiOutlineEdit, AiFillDelete } from "react-icons/ai";
import dayjs from "dayjs";
import CreateTask from "./CreateTask";

interface TaskItemProps {
  todo: TodoItem;
  inputDate: string;
  inputTime: string;
  index: number;
  isEditing: boolean;
  editText: string;
  onEdit: (id: string, text: string,scheduledDate: string, scheduledTime:string) => void;
  onDelete: (id: string) => void;
  onToggleDone: (id: string, newValue: boolean) => void;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditSubmit: () => void;
  onEditCancel: () => void;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  todo,
  isEditing,
  editText,
  inputDate,
  inputTime,
  onEdit,
  onDelete,
  onToggleDone,
  onEditChange,
  onEditSubmit,
  onEditCancel,
  onDateChange,
  onTimeChange,
}) => {
  // const createdDate = new Date(todo.createdAt);
  // const date = createdDate.toLocaleDateString();
  const { time } = formatDateTime(todo.createdAt);

  return (
    <div className="todo-item-wrapper items-center justify-between flex gap-2 rounded-2xl p-4 mt-4 hover:transition-all duration-300 shadow-md">
      <div className="text-xl font-extrabold">{time}</div>

      <div className="todo-item-text flex flex-col flex-grow px-4">
        <div className="font-medium"> {todo.todoText}</div>

        <div
          className="todo-item-update cursor-pointer flex items-center gap-2 text-sm"
          onClick={() => onEdit(todo.id, todo.todoText, todo.scheduledDate, todo.scheduledTime)}
        >
          <AiOutlineEdit className="text-2sm" />
          <span>Edit</span>
          {isEditing && (
            <CreateTask
              inputText={editText}
              // inputDate={dayjs(todo.createdAt).format("YYYY-MM-DD")}
              // inputTime={dayjs(todo.createdAt).format("HH:mm")}
              inputDate={inputDate}
              inputTime={inputTime}
              mode="EDIT"
              onChange={onEditChange}
              onDateChange={onDateChange}
              onTimeChange={onTimeChange}
              onSubmit={onEditSubmit}
              onCancel={onEditCancel}
              onClose={onEditCancel}
            />
          )}
          {!isEditing && (
            <div
              className="todo-item-delete flex cursor-pointer items-center justify-center gap-2 text-red-500 "
              onClick={() => onDelete(todo.id)}
            >
              <AiFillDelete /> Delete
            </div>
          )}
        </div>
      </div>

      {/* checkbox */}
      <div className="flex items-center gap-3 py-2">
        <input
          type="checkbox"
          checked={todo.isDone}
          onChange={(e) => onToggleDone(todo.id, e.target.checked)}
          className="w-6 h-6 bg-white accent-white outline-none ring-0 focus:ring-0 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default TaskItem;

function formatDateTime(dateStr: string) {
  if (!dayjs(dateStr).isValid()) {
    return { date: "N/A", time: "N/A" };
  }
  const dt = dayjs(dateStr);
  const date = dt.format("D/MM/YY");
  const time = dt.format("HH:mm");
  return { date, time };
}
