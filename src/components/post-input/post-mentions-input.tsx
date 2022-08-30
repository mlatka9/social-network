import useSuggestionList from "src/hooks/use-suggestion-popup";
import clsx from "clsx";
import { ChangeEvent, useState } from "react";
import { useSearchUsersQuery } from "src/hooks/query";
import type { SearchUserType } from "@/types/db";

interface PostTagsInputProps {
  mentions: SearchUserType[];
  setMentions: (mentions: SearchUserType[]) => void;
}

const PostMentionsInput = ({ setMentions, mentions }: PostTagsInputProps) => {
  const [mentionInputValue, setMentionInputValue] = useState("");

  const addMention = (mention: SearchUserType) => {
    const userId = mention.id;
    const isAlreadyInState = mentions.some((mention) => mention.id === userId);
    if (isAlreadyInState) {
      setMentionInputValue("");
      return;
    }
    setMentions([...mentions, mention]);
    setMentionInputValue("");
  };

  const { data } = useSearchUsersQuery(mentionInputValue);

  const { inputProps, selectedItemIndex, suggestionData, wrapperProps } =
    useSuggestionList({ data, onSelect: addMention });

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowUp":
      case "ArrowDown":
      case "Enter":
        e.preventDefault();
        break;
      case "Backspace":
        if (!mentionInputValue.length && mentions.length) {
          setMentions([...mentions.slice(0, -1)]);
        }
        break;
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    // if (e.target.value === " ") return;
    setMentionInputValue(e.target.value);
  };

  return (
    <div className="relative w-full" {...wrapperProps}>
      <input
        className="text-md  dark:bg-primary-dark-100 w-full"
        placeholder={mentions.length ? "Add another..." : "Add mention"}
        value={mentionInputValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        {...inputProps}
      />
      {/* {mentionInputValue && (
        <div className="absolute right-1 top-1 font-medium text-xs text-gray-400">
          space to add
        </div>
      )} */}

      <div className="absolute top-full left-0 z-[5] w-full rounded-br-md rounded-bl-md overflow-hidden shadow-lg">
        {suggestionData.map((mention, index) => (
          <div
            onClick={() => addMention(mention)}
            key={mention.id}
            className={clsx([
              "p-3 bg-white fle flex-col cursor-pointer hover:bg-blue-50 dark:bg-primary-dark-200 hover:dark:bg-primary-dark-300",
              selectedItemIndex === index &&
                "bg-primary-100 dark:bg-primary-dark-300",
            ])}
          >
            {mention.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostMentionsInput;
