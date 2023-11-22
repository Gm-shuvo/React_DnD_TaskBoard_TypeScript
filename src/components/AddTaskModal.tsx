import { FC } from "react";
import TaskForm from "./AddTaskForm";
import { Id, Task } from "../types";

interface AddTaskModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addNewTask: (task: Task) => void;
  AddColumnId: Id | null;
}

const AddTaskModal:FC<AddTaskModalProps> = ({ isModalOpen, setIsModalOpen, addNewTask, AddColumnId }) => {
  return (
    <div className={`modal ${isModalOpen ? "modal-open" : ""}`}>
      <div className="modal-box p-0  max-w-2xl h-[400px] relative bg-slate-300">
        <button
          className="text-gray-500 absolute w-8 h-8 rounded-full text-center text-sm hover:bg-slate-500/20 bg-slate-500/10 top-2 right-2 z-40"
          onClick={() => setIsModalOpen(false)}
        >
          ✕
        </button>
        {/* Add Task Form */}
        <TaskForm
          addNewTask={addNewTask}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          AddColumnId={AddColumnId}
        />
      </div>
      <div
        className="modal-backdrop"
        onClick={() => setIsModalOpen(false)}
      ></div>
    </div>
  );
};

export default AddTaskModal;
