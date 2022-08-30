import { Tag } from "@prisma/client";
import Image from "next/image";

interface SelectedTagsListProps {
  tags: Tag[];
  handleRemoveTag: (tagName: string) => void;
}

const SelectedTagsList = ({ tags, handleRemoveTag }: SelectedTagsListProps) => {
  return (
    <div className="w-fit flex">
      {tags.map((tag) => (
        <div
          className=" text-white rounded-md p-1 mr-2 flex items-center"
          style={{ backgroundColor: tag.color }}
          key={tag.name}
        >
          <span>#{tag.name}</span>
          <button
            onClick={() => handleRemoveTag(tag.name)}
            className="ml-1 justify-center flex items-center shrink-0 w-4 h-4"
          >
            <Image src="/icons/close.png" height="16" width="16" alt="" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SelectedTagsList;
