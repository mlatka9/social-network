import useSuggestionList from "src/hooks/use-suggestion-popup";
import clsx from "clsx";
import { ChangeEvent, useState } from "react";
import { useSearchTagQuery } from "src/hooks/query";
import { Tag } from "@prisma/client";

const DEFAULT_TAG_COLOR = "#c1d0e3";

interface PostTagsInputProps {
  tags: Tag[];
  setTags: (tag: Tag[]) => void;
}

const PostTagsInput = ({ setTags, tags }: PostTagsInputProps) => {
  const [tagInputValue, setTagInputValue] = useState("");

  const addTag = (tag: Tag) => {
    const tagName = tag.name;
    const formattedTagName = tagName.trim().toLowerCase();
    const isAlreadyInState = tags.some((tag) => tag.name === formattedTagName);
    if (isAlreadyInState || !formattedTagName) {
      return;
    }
    const newTag = { ...tag, name: formattedTagName };
    setTags([...tags, newTag]);
    setTagInputValue("");
  };

  const { data: hintTags } = useSearchTagQuery(tagInputValue);

  const { inputProps, selectedItemIndex, suggestionData, wrapperProps } =
    useSuggestionList({ data: hintTags, onSelect: addTag });

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowUp":
      case "ArrowUp":
      case "Enter":
        e.preventDefault();
      case " ":
        addTag({
          name: tagInputValue,
          color: DEFAULT_TAG_COLOR,
        });
        break;
      case "Backspace":
        if (!tagInputValue.length && tags.length) {
          setTags([...tags.slice(0, -1)]);
        }
        break;
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === " ") return;
    setTagInputValue(e.target.value);
  };

  return (
    <div className="relative" {...wrapperProps}>
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
  );
};

export default PostTagsInput;
