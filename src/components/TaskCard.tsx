import { useState } from "react";
import { Id, Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTheme } from "../contexts/ThemeContext";
import TagLists from "./TagLists";

import { FiToggleLeft, FiToggleRight } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  OnRemoveTag: (id: Id, tag: string) => void;
  toggleTaskActivity: (id: Id) => void;
}

function TaskCard({
  task,
  deleteTask,
  updateTask,
  OnRemoveTag,
  toggleTaskActivity,
}: Props) {
  const { theme } = useTheme();
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState(task?.content);

  console.log("task", task);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={` 
        opacity-30
        ${
          theme === "dark"
            ? "bg-mainDarkBackgroundColor"
            : "bg-mainLightBackgroundColor"
        }
        p-2.5 
        h-[100px] 
        min-h-[100px] 
        items-center 
        flex
        text-black
        text-left 
        rounded-xl 
        border-2
       border-rose-500  
         cursor-grab 
         relative
        `}
      />
    );
  }

  if (editMode) {
    return (
      <>
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className={`
        ${
          theme === "dark"
            ? "bg-mainDarkBackgroundColor"
            : "bg-mainLightBackgroundColor"
        }
        p-2.5 h-[100px] min-h-[100px] flex flex-col items-start justify-start text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative
        `}
        >
          <textarea
            className="
        h-[90%]
        w-full resize-none border-none rounded bg-transparent focus:outline-none
        "
            value={content}
            autoFocus
            placeholder="Task content here"
            onBlur={toggleEditMode}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) {
                updateTask(task.id, content);
                toggleEditMode();
              }
            }}
            onChange={(e) => setContent(e.target.value)}
          />

          <TagLists tags={task.tags} id={task.id} onRemoveTag={OnRemoveTag} />
        </div>
        {editMode && (
          <label className="text-xs ">
            Press <kbd>Shift</kbd>+<kbd>Enter</kbd> to save
          </label>
        )}
      </>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className={`
     ${
       theme === "dark"
         ? "bg-mainDarkBackgroundColor"
         : "bg-mainLightBackgroundColor"
     }
      p-2.5 
      h-[100px] 
      min-h-[100px] 
      items-start
      justify-start 
      flex 
      flex-col
      text-left 
      rounded-xl 
      hover:ring-2 
      hover:ring-inset
       hover:ring-rose-500 
       cursor-grab 
       relative 
       task`}
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <p className="my-auto h-[100%] w-full pr-10 overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>
      <p
        className={`${
          mouseIsOver ? "hidden" : "absolute"
        }  right-3 top-3 text-xs px-2 border rounded-full ${
          task.active ? " text-green-500" : "text-gray-600"
        }`}
        
      >
        {task.active ? "active" : "off"}
      </p>
      <TagLists tags={task.tags} id={task.id} onRemoveTag={OnRemoveTag} />

      {mouseIsOver && (
        <div className=" absolute right-0 top-0 bottom-0 h-full w-20 flex flex-col items-center justify-center gap-2 rounded-tr-xl rounded-br-xl">
          <button
            className={`
       w-[40px] 
       h-[40px]
        ${
          theme === "dark"
            ? "bg-mainDarkBackgroundColor stroke-white "
            : "bg-mainLightBackgroundColor stroke-gray-500 "
        }
        hover: stroke-rose-500
        p-2
        text-xl
        text-center
        flex
        justify-center
        items-center
        rounded
        opacity-60
        hover:opacity-100
        `}
        onClick={(e) => {
          e.stopPropagation();
          toggleTaskActivity(task.id)
        }}
          >
            {task.active ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
            className={`
          w-[40px]
            h-[40px]
          ${
            theme === "dark"
              ? "bg-mainDarkBackgroundColor stroke-white "
              : "bg-mainLightBackgroundColor stroke-gray-500 "
          }
          hover: text-red-500
          p-2 
          rounded 
          flex
          text-xl
          justify-center
          items-center
          opacity-60 
          hover:opacity-100
          `}
          >
            <FaRegTrashAlt />
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
