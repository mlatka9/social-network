/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import useSuggestionList from 'src/hooks/use-suggestion-popup';
import clsx from 'clsx';
import { ChangeEvent, useState } from 'react';
import { useSearchTagQuery } from 'src/hooks/query';
import { Tag } from '@prisma/client';

const DEFAULT_TAG_COLOR = '#c1d0e3';

interface PostTagsInputProps {
  tags: Tag[];
  setTags: (tag: Tag[]) => void;
}

const PostTagsInput = ({ setTags, tags }: PostTagsInputProps) => {
  const [tagInputValue, setTagInputValue] = useState('');

  const addTag = (tag: Tag) => {
    const tagName = tag.name;
    const formattedTagName = tagName.trim().toLowerCase();
    const isAlreadyInState = tags.some((t) => t.name === formattedTagName);
    if (isAlreadyInState || !formattedTagName) {
      setTagInputValue('');
      return;
    }
    const newTag = { ...tag, name: formattedTagName };
    setTags([...tags, newTag]);
    setTagInputValue('');
  };

  const { data: hintTags } = useSearchTagQuery(tagInputValue);

  const { inputProps, selectedItemIndex, suggestionData, wrapperProps } =
    useSuggestionList({ data: hintTags, onSelect: addTag });

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'Enter':
        e.preventDefault();
        break;
      case ' ':
        addTag({
          name: tagInputValue,
          color: DEFAULT_TAG_COLOR,
        });
        break;
      case 'Backspace':
        if (!tagInputValue.length && tags.length) {
          setTags([...tags.slice(0, -1)]);
        }
        break;
      default:
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === ' ') return;
    setTagInputValue(e.target.value);
  };

  return (
    <div className="relative w-full" {...wrapperProps}>
      <input
        className="text-md  dark:bg-primary-dark-100 w-full"
        placeholder={tags.length ? 'Add another...' : 'Add tag'}
        value={tagInputValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        {...inputProps}
      />
      {tagInputValue && (
        <div className="absolute right-1 top-1 font-medium text-xs text-gray-400">
          space to add
        </div>
      )}

      <div className="absolute top-full left-0 z-[5] w-full rounded-br-md rounded-bl-md overflow-hidden shadow-lg">
        {suggestionData.map((tag, index) => (
          <div
            onClick={() => addTag(tag)}
            key={tag.name}
            className={clsx([
              'p-3 bg-white fle flex-col cursor-pointer hover:bg-blue-50 dark:bg-primary-dark-200 hover:dark:bg-primary-dark-300',
              selectedItemIndex === index &&
                'bg-primary-100 dark:bg-primary-dark-300',
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
