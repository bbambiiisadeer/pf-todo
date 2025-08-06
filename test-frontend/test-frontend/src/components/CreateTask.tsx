import { motion } from "motion/react";

interface CreateTaskProps {
  inputText: string;
  inputDate: string;
  inputTime: string;
  mode: "ADD" | "EDIT";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onClose: () => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({
  inputDate,
  inputTime,
  inputText,
  mode,
  onChange,
  onSubmit,
  onCancel,
  onDateChange,
  onTimeChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.2,
        scale: { type: "spring", visualDuration: 0.3, bounce: 0.2 },
      }}
      className="fixed inset-0 z-50 flex justify-center items-center px-4"
    >
      <div>
        {/* CONTENT */}
        <div onClick={(e) => e.stopPropagation()} className="relative rounded-2xl bg-gradient-to-b from-[#CABDFF] to-white shadow-lg p-6 w-[546px] max-w-full text-black">
          <h1 className="mb-6 font-[Montserrat] font-bold text-base">Create Task</h1>
          {/* TITLE */}
          <label className="block">
            <div className="text-sm font-[Montserrat] font-semibold mb-2">Title</div>
            <input
              type="text"
              value={inputText}
              onChange={onChange}
              placeholder="What's your task?"
              className="w-full rounded-md border border-gray-400 px-2 py-1 text-sm focus:outline-none focus:ring-2 "
            />
          </label>
          {/* DATE+TIME */}
          <div className="flex space-x-4 mt-4 mb-8">
            <div className="flex-1">
              <label className="block font-[Montserrat] text-sm font-semibold text-black mb-1">
                Date
              </label>
              <input
                type="date"
                value={inputDate}
                onChange={(e) => {
                  e.stopPropagation(); 
                  onDateChange(e);
                }}
                className="text-gray-500 w-full rounded-md border border-gray-400 px-2 py-1 text-sm focus:outline-none focus:ring-2 "
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-[Montserrat] font-semibold text-black mb-1">
                Time
              </label>
              <input
                type="time"
                value={inputTime}
                onChange={(e) => {
                  e.stopPropagation(); 
                  onTimeChange(e)
                }}
                className="text-gray-500 w-full rounded-md border border-gray-400 px-2 py-1 text-sm focus:outline-none focus:ring-2 "
              />
            </div>
          </div>
          {/* BUTTON */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
              className="text-gray-500 font-[itim] hover:text-red-500 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={onSubmit}
              className="bg-[#9284E5] px-4 py-2 font-[itim] rounded-md text-white hover:bg-[#7C6AE5] cursor-pointer transition"
            >
              {mode === "ADD" ? "Create Task" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateTask;
