import { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import UpcomingTaskList from "./UpcomingTaskList";
import type { Value } from "react-calendar/dist/shared/types.js";
import { Link } from "react-router-dom";
import { HiUserCircle } from "react-icons/hi";
import { useAuth } from "../context/useAuth"; // ดึง AuthContext

const SideBar = () => {
  const [selectedDate, setSelecteDate] = useState<Value>(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(); // ใช้ logout จาก context
  };

  return (
    <>
      <div>
        {isAuthenticated ? (
          <div
            className="pb-15 flex items-center justify-end gap-x-3 relative"
            ref={dropdownRef}
          >
            <div className="flex flex-col items-end">
              <div className="text-base font-medium text-[#756AB6]">
                {user?.username || "No Name"}
              </div>
              <div className="text-xs text-[#878787]">{user?.email}</div>
            </div>

            <button
              className="text-5xl text-[#756AB6] cursor-pointer hover:text-[#5b4e9f] transition-all duration-200"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <HiUserCircle />
            </button>

            {dropdownOpen && (
              <div className="absolute mt-1 top-[calc(50%+2px)] right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-28">
                <button
                  onClick={handleLogout}
                  className="w-full px-2 py-1 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-t-lg hover:text-red-500 cursor-pointer transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-end">
            <Link to={"/login"}>
              <button className="mb-6 text-sm font-medium bg-[#756AB6] px-4 py-1.5 rounded-full text-white cursor-pointer hover:bg-white border border-[#756AB6] hover:text-[#756AB6] transition-all duration-300 shadow-sm">
                Login
              </button>
            </Link>
          </div>
        )}

        {/* CALENDAR */}
        <div className="w-full p-4 bg-white shadow-md rounded-xl space-y-6 mb-6">
          <Calendar
            onChange={setSelecteDate}
            value={selectedDate}
            className="rounded-xl text-xs font-bold text-[#534895] w-full"
            calendarType="gregory"
            formatShortWeekday={(_locale, date) =>
              ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][date.getDay()]
            }
            showNeighboringMonth={true}
          />
        </div>

        {/* UPCOMING TASKS */}
        <div>
          <UpcomingTaskList
            selectedDate={
              selectedDate instanceof Date ? selectedDate : new Date()
            }
          />
        </div>
      </div>
    </>
  );
};

export default SideBar;
