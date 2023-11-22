import React, { FC, useEffect, useState } from "react";
import TagInput from "./TagInput";
import { Id, Tag, Task } from "../types";

interface AddTaskFormProps {
  addNewTask: (task: Task) => void;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  AddColumnId: Id | null;
}

const AddTaskForm: FC<AddTaskFormProps> = ({
  addNewTask,
  setIsModalOpen,
  AddColumnId,
}) => {
  const [newTaskName, setNewTaskName] = useState<string>("");
  const [userTags, setUserTags] = useState<Tag>([]);

  //input validation
  const taskNameError =
    newTaskName.trim() === "" ? "Task name cannot be empty" : null;
  const tagsError =
    userTags.length === 0
      ? "Please add at least one tag"
      : userTags.length >= 5
      ? "You can't add up to 5 tags"
      : null;

  const handleAddNewTask = () => {
    if (newTaskName.trim() !== "") {
      const newTask: Task = {
        id: Math.floor(Math.random() * 10000),
        columnId: AddColumnId as Id,
        content: newTaskName,
        tags: userTags,
        active: false,
        activityLog: [],
        lastStatusChange: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      console.log(newTask);
      addNewTask(newTask);
      setNewTaskName("");
      setUserTags([]);
      setIsModalOpen(false);
    }
  };

  let tags: Tag = [];

  const fetchTags = async () => {
    tags = await fetch("http://localhost:3010/tags")
      .then((res) => res.json())
      .then((data) => data as Tag);
    console.log(tags);
  };

  // Get all tags
  useEffect(() => {
    fetchTags();
  }, []);

  // console.log(tags);

  return (
    <div className="mt-10 flex flex-col justify-center">
      <label htmlFor="newTaskName" className=" text-lg mb-2">
        Task Content
      </label>
      <textarea
        placeholder="New Task Name"
        value={newTaskName}
        onChange={(e) => setNewTaskName(e.target.value)}
        className="w-full bg-primary-content/30 rounded-md px-2 py-1 mb-4 outline-none focus:ring-2 focus:ring-primary"
      />
      {taskNameError && (
        <p className="text-red-500 text-sm mb-2">{taskNameError}</p>
      )}
      <label htmlFor="tags" className=" text-lg mb-2">
        Tags
      </label>

      {/* Add tags suggetions new tags*/}
      <TagInput
        suggestedTags={tags}
        setUserTags={setUserTags}
        userTags={userTags}
      />
      {tagsError && <p className="text-red-500 text-sm mb-2">{tagsError}</p>}
      <button
        onClick={handleAddNewTask}
        disabled={taskNameError || tagsError ? true : false}
        className="absolute bottom-6 right-4 left-4 px-4 py-2 border bg-transparent rounded hover:bg-black/60 hover:text-white"
      >
        Add Task
      </button>
    </div>
  );
};

export default AddTaskForm;
