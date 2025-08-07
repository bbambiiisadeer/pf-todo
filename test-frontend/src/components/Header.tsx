import React from "react";
import type { TodoItem } from "../types";
import dayjs from "dayjs";


type HeaderSectionProps = {
  todos: TodoItem[];
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header: React.FC<HeaderSectionProps> = ({ todos, setOpenModal }) => {
  function getMotivationMessage(percent: number): string {
    if (percent === 100) return "All done! Great work!";
    if (percent >= 70) return "Allmost there!";
    if (percent >= 30) return "You're in the flow... ";
    return "Just getting start";
  }

  function getProgress(todos: TodoItem[]) {
    const total = todos.length;
    const done = todos.filter((t) => t.isDone).length;
    const percentage = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, percentage };
  }

  const { percentage } = getProgress(todos);
  const message = getMotivationMessage(percentage);
  const today = dayjs().format("MMM D, YYYY");

  return (
    <div className="p-4 rounded-xl bg-[#756AB6] mb-4">
      {/* TOP BAR: DATE + ADD NEW BUTTON */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 text-center text-base font-extrabold text-white">
          {today}
        </div>
      </div>

      {/* TODAY */}
      <div className="text-4xl font-medium text-white">Today</div>

      {/* PROGRESS BAR */}
      <div className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#50DE99] transition-all rounded-full duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* MOTIVATION MESSAGE */}
      <div className="text-white font-[itim] flex gap-4 text-base justify-between font-medium mt-4">
        <div>
          <p className="font-semibold">{percentage} %</p>
          <p className="font-base">{message}</p>
        </div>
        <button
          onClick={() => setOpenModal((prev) => !prev)}
          className="text-base font-[itim] font-semibold cursor-pointer rounded-lg p-2 bg-white text-[#756AB6] shadow-lg hover:bg-[#756AB6] border-3 transition-all duration-200 hover:text-white"
        >
          + Add New
        </button>

      </div>
    </div>
  );
};

export default Header;
