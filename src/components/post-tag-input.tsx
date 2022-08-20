import useSuggestionList from "src/hooks/use-suggestion-popup";
import clsx from "clsx";
import { ChangeEvent, useState } from "react";
import { useSearchTagQuery } from "src/hooks/query";
import type { LocalTagType } from "@/components/post-input";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

interface PostTagInputProps {
  tags: LocalTagType[];
  setTags: (tag: LocalTagType[]) => void;
}

const PostTagInput = ({ setTags, tags }: PostTagInputProps) => {
  const [tagInputValue, setTagInputValue] = useState("");

  const { data: hintTags } = useSearchTagQuery(tagInputValue);

  const addTag = (tag: LocalTagType) => {
    const tagName = tag.name;
    const formattedTagName = tagName.trim().toLowerCase();
    if (
      tags.some((tag) => tag.name === formattedTagName) ||
      !formattedTagName
    ) {
      return;
    }
    setTags([...tags, { ...tag, name: formattedTagName }]);
    setTagInputValue("");
  };

  const { inputProps, selectedItemIndex, suggestionData, wrapperProps } =
    useSuggestionList({ data: hintTags, onSelect: addTag });

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowUp") {
      e.preventDefault();
    }
    if (e.key === " ") {
      addTag({
        id: uuidv4(),
        name: tagInputValue,
        color: "#c1d0e3",
        status: "new",
      });
    }
    if (e.key === "Enter") {
      e.preventDefault();
    }
    if (e.key === "Backspace") {
      if (!tagInputValue.length) {
        if (tags.length) {
          setTags([...tags.slice(0, -1)]);
        }
      }
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === " ") return;
    setTagInputValue(e.target.value);
  };

  const removeTag = (name: string) => {
    setTags(tags.filter((tag) => tag.name !== name));
  };

  return (
    <div className="flex relative mb-3 items-center" {...wrapperProps}>
      <div className="w-fit flex">
        {tags.map((tag) => (
          <div
            className="bg-orange-600 text-white rounded-md p-1 mr-2 flex items-center"
            style={{ backgroundColor: tag.color }}
            key={tag.name}
          >
            <span>#{tag.name}</span>
            <button
              onClick={() => removeTag(tag.name)}
              className="ml-1 justify-center flex items-center p-1"
            >
              <Image src="/icons/close.png" height="16" width="16" alt="" />
            </button>
          </div>
        ))}
      </div>
      <div className="relative">
        <input
          className="text-md"
          placeholder={tags.length ? "Add another..." : "Add tag"}
          value={tagInputValue}
          onChange={onChange}
          onKeyDown={onKeyDown}
          {...inputProps}
        />

        <div className="absolute top-full left-0 z-[5] w-full rounded-br-md rounded-bl-md overflow-hidden shadow-lg">
          {suggestionData.map((tag, index) => (
            <div
              onClick={() => addTag(tag)}
              key={tag.name}
              className={clsx([
                "p-3 bg-white fle flex-col cursor-pointer hover:bg-blue-50",
                selectedItemIndex === index && "bg-blue-50",
              ])}
            >
              {tag.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostTagInput;
