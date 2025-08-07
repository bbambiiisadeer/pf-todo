import axios from "axios";
import { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import type { TodoItem } from "../types";

const UpcomingTaskList = ({ selectedDate }: { selectedDate: Date }) => {
  const [tasks, setTasks] = useState<TodoItem[]>([]);

  useEffect(() => {
    const fetchUpcomingTasks = async () => {
      try {
        axios.get("/api/todo").then((res) => {
          const allTasks: TodoItem[] = res.data;
          // วันพรุ่งนี้
          const today = new Date(selectedDate);
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          // clear เวลาให้เปรียบเทียบแค่วันที่
          const tomorrowStart = new Date(tomorrow);
          tomorrowStart.setHours(0, 0, 0, 0);
          const tomorrowEnd = new Date(tomorrow);
          tomorrowEnd.setHours(23, 59, 59, 999);
          // filter งานเฉพาะวันพรุ่งนี้
          const tomorrowTasks = allTasks.filter((task: TodoItem) => {
            if (!task.scheduledDate) return false;

            const taskDate = new Date(task.scheduledDate);
            return taskDate >= tomorrowStart && taskDate <= tomorrowEnd;
          });

          setTasks(tomorrowTasks);
        });
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchUpcomingTasks(); // reload when mount or selectedDate changed

    const interval = setInterval(() => {
      fetchUpcomingTasks(); 
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedDate]);

  if (tasks.length === 0) {
    return (
      <p className="font-[Montserrat] text-lg font-bold">No upcomming tasks.</p>
    );
  }

  return (
    <div className="p-6 font-[Montserrat]">
      <h2 className="text-lg font-bold  text-[#534895] mb-4">Upcoming Tasks</h2>
      <ul className="space-y-2">
        {tasks.map((task: TodoItem) => (
          <li key={task.id} className="flex items-start group border-b-1">
            <div className="flex mt-4 mb-2 pr-3 gap-3 text-gray-700 text-xs font-semibold group-hover:text-[#756AB6] cursor-pointer transition-colors">
              <FaArrowRightLong /> {task.todoText}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingTaskList;
