/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import useSuggestionList from 'src/hooks/use-suggestion-popup';
import clsx from 'clsx';
import { ChangeEvent, useState } from 'react';
import { useSearchUsersQuery } from 'src/hooks/query';
import type { SearchUserType } from '@/types/db';

interface PostTagsInputProps {
  mentions: SearchUserType[];
  setMentions: (mentions: SearchUserType[]) => void;
}

const PostMentionsInput = ({ setMentions, mentions }: PostTagsInputProps) => {
  const [mentionInputValue, setMentionInputValue] = useState('');

  const addMention = (mention: SearchUserType) => {
    const userId = mention.id;
    const isAlreadyInState = mentions.some((m) => m.id === userId);
    if (isAlreadyInState) {
      setMentionInputValue('');
      return;
    }
    setMentions([...mentions, mention]);
    setMentionInputValue('');
  };

  const { data } = useSearchUsersQuery(mentionInputValue);

  const { inputProps, selectedItemIndex, suggestionData, wrapperProps } =
    useSuggestionList({ data, onSelect: addMention });

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'Enter':
        e.preventDefault();
        break;
      case 'Backspace':
        if (!mentionInputValue.length && mentions.length) {
          setMentions([...mentions.slice(0, -1)]);
        }
        break;
      default:
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    // if (e.target.value === " ") return;
    setMentionInputValue(e.target.value);
  };

  return (
    <div className="relative flex-grow flex " {...wrapperProps}>
      <input
        className="text-md w-[100px] flex-grow dark:bg-primary-dark-200 h-8 dark:placeholder:text-primary-dark-600"
        placeholder={mentions.length ? 'Add another...' : 'Add mention'}
        value={mentionInputValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        {...inputProps}
      />
      <div className="absolute top-full left-0 z-[10] w-full rounded-br-md rounded-bl-md overflow-hidden shadow-lg">
        {suggestionData.map((mention, index) => (
          <div
            onClick={() => addMention(mention)}
            key={mention.id}
            className={clsx([
              'p-3 bg-white fle flex-col cursor-pointer hover:bg-blue-50 dark:bg-primary-dark-200 hover:dark:bg-primary-dark-300',
              selectedItemIndex === index &&
                'bg-primary-100 dark:bg-primary-dark-300',
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
