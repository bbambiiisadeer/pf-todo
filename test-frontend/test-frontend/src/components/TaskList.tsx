import React from "react";
import type { TodoItem } from "../types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  todos: TodoItem[];
  currentEdittingID: string | null;
  editText: string;
  inputDate: string;
  inputTime: string;
  onEdit: (id: string, text: string, scheduledDate: string, scheduledTime:string) => void;
  onDelete: (id: string) => void;
  onToggleDone: (id: string, newValue: boolean) => void;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditSubmit: () => void;
  onEditCancel: () => void;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  todos,
  currentEdittingID,
  editText,
  onEdit,
  inputDate,
  inputTime,
  onDelete,
  onToggleDone,
  onEditChange,
  onEditCancel,
  onEditSubmit,
  onDateChange,
  onTimeChange,
}) => {
  const sortedTodos = [...todos].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div>
      {sortedTodos.map((todo, i) => (
        <TaskItem
          key={todo.id}
          todo={todo}
          index={i}
          isEditing={todo.id === currentEdittingID}
          editText={editText}
          inputDate={inputDate}
          inputTime={inputTime}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleDone={onToggleDone}
          onEditChange={onEditChange}
          onEditCancel={onEditCancel}
          onEditSubmit={onEditSubmit}
          onDateChange={onDateChange}
          onTimeChange={onTimeChange}
        />
      ))}
    </div>
  );
};

export default TaskList;
