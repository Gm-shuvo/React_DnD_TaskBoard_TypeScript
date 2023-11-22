import React, { FC, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Tag } from "../types";

interface TagInputProps {
  suggestedTags?: Tag;
  setUserTags: React.Dispatch<React.SetStateAction<Tag>>;
  userTags: Tag;
}

const TagInput: FC<TagInputProps> = ({ suggestedTags = [], setUserTags, userTags }) => {
  const [userInput, setUserInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && userTags?.length <= 4) {
      handleAddTag();
    }
  };

  const handleInputChange= (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
  };

  const handleTagClick = (tag: string) => {
    setUserTags([...userTags, tag]);
    setUserInput(""); // Clear the input field
  };

  const handleAddTag = () => {
    if (userInput) {
      setUserTags([...userTags, userInput]);
      setUserInput(""); // Clear the input field
    }
  };

  const handleRemoveTag = (tag: string) => {
    const updatedTags = userTags.filter((t) => t !== tag);
    setUserTags(updatedTags);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full flex flex-row flex-wrap mb-4">
        {userTags?.map((tag) => (
          <span
            key={tag}
            className="flex flex-row items-center justify-center bg-slate-400/30 rounded-md px-2 py-1 mr-2"
          >
            <h1 className="text-sm font-semibold">{tag}</h1>
            <button onClick={() => handleRemoveTag(tag)} className="ml-2">
              <AiOutlineCloseCircle className="w-4 h-4" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter tags..."
          className="w-full bg-primary-content/30 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleAddTag}
          className="w-6 h-6 rounded-full border-2 flex items-center justify-center font-semibold hover:bg-slate-400/40"
        >
          +
        </button>
      </div>
      <ul>
        {suggestedTags
          ?.filter((tag) => userInput.includes(tag))
          .map((tag) => (
            <li key={tag} onClick={() => handleTagClick(tag)}>
              {tag}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TagInput;
