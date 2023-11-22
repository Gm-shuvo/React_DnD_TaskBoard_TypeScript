import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";
import { useTheme } from "../contexts/ThemeContext";

interface ColumnContainerProps {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[];
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAddColumnId: React.Dispatch<React.SetStateAction<Id | null>>;
  onRemoveTag: (id: Id, tag: string) => void;
  toggleTaskActivity: (id: Id) => void;
}

function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  tasks,
  deleteTask,
  updateTask,
  setIsModalOpen,
  setAddColumnId,
  onRemoveTag,
  toggleTaskActivity,

}: ColumnContainerProps) {
  const { theme } = useTheme();
  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`${
          theme == "dark"
            ? "bg-mainDarkBackgroundColor text-white"
            : "bg-mainLightBackgroundColor text-black"
        } 
        opacity-40
        border-2
        border-pink-500
        w-[350px]
        h-[500px]
        max-h-[500px]
        rounded-md
        flex
        flex-col`}
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${
        theme == "dark"
          ? "bg-darkColumnBackgroundColor  text-white"
          : "bg-lightColumnBackgroundColor  text-black"
      } 
      w-[350px]
      h-[500px]
      max-h-[500px]
      rounded-md
      flex
      flex-col`}
    >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className={`${
          theme == "dark"
            ? "bg-darkColumnBackgroundColor"
            : "bg-lightColumnBackgroundColor"
        }
       
        text-md
        h-[60px]
        cursor-grab
        rounded-md
        rounded-b-none
        p-3
        font-bold
       ${theme == "dark" ? "border-white/60" : "border-gray-400"}
        border-b-2
        shadow-md
        flex
        items-center
        justify-between`}
      >
        <div className="flex gap-2">
          <div
            className={`flex
            justify-center
            items-center
            bg-rose-500
            px-2
            py-1
            text-sm
            rounded-full`}
          >
            {tasks.length}
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className=" focus:border-rose-500 border rounded outline-none px-2"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className={`${theme == "dark" ? " hover:stroke-white hover:bg-darkColumnBackgroundColor" : " hover:stroke-black hover:bg-lightColumnBackgroundColor"} 
          stroke-gray-500
          rounded
          px-1
          py-2`}
        >
          <TrashIcon />
        </button>
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
              OnRemoveTag={onRemoveTag}
              toggleTaskActivity={toggleTaskActivity}
            />
            
          ))}
        </SortableContext>
      </div>
      {/* Column footer */}
      <button
        className={`
        ${
          theme == "dark"
            ? "bg-darkColumnBackgroundColor"
            : "bg-lightColumnBackgroundColor"
        }
        flex
        gap-2 
        items-center 
        border
        rounded-md 
        p-4
        
        ${
          theme == "dark"
            ? "border-white/60 hover:bg-mainDarkBackgroundColor"
            : "border-gray-400 hover:bg-mainLightBackgroundColor"
        }
        hover:text-rose-500 
      `}
        onClick={() => {
          // createTask(column.id);
          setAddColumnId(column.id);
          setIsModalOpen(true);
        }}
      >
        <PlusIcon />
        Add task
      </button>
    </div>
  );
}

export default ColumnContainer;
