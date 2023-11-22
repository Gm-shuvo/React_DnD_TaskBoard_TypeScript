import { Id } from "../types";

interface TagListsProps {
  id: Id;
  tags: string[];
  onRemoveTag: (id: Id, tag: string) => void;
}

interface TagProps {
  id: Id;
  tag: string;
  onRemoveTag: (id: Id, tag: string) => void;
}
const Tag = ({id, tag, onRemoveTag}: TagProps) => (
  <div className="bg-gray-200 rounded-full px-2 py-0.5 text-xs font-semibold text-gray-700 mr-1 mb-1">
    {tag}
    <span className="ml-1" onClick={(e)=> {
      e.stopPropagation()
      onRemoveTag(id, tag)
      }}>x</span>
  </div>
);


function TagLists ({tags, onRemoveTag, id}: TagListsProps) {
  return (
    <div className="flex flex-wrap items-start">
      {tags.map((tag) => (
        <Tag key={tag} tag={tag} id={id} onRemoveTag={onRemoveTag}/>
      ))}
    </div>
  );
}

export default TagLists;