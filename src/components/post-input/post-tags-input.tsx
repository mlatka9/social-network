/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import useSuggestionList from 'src/hooks/use-suggestion-popup';
import clsx from 'clsx';
import { ChangeEvent, useState } from 'react';
import { useSearchTagQuery } from 'src/hooks/query';
import { Control, UseFormSetValue, useWatch } from 'react-hook-form';
import { PostInputFormType } from './types';

interface PostTagsInputProps {
  control: Control<PostInputFormType>;
  setValue: UseFormSetValue<PostInputFormType>;
}

const PostTagsInput = ({ control, setValue }: PostTagsInputProps) => {
  const [tagInputValue, setTagInputValue] = useState('');

  const tags = useWatch({ control, name: 'tags', defaultValue: [] });

  const setTags = (newTags: string[]) => {
    setValue('tags', newTags);
  };

  const addTag = (tag: string) => {
    const formattedTagName = tag
      .trim()
      .toLowerCase()
      .replaceAll('#', '')
      .replaceAll(' ', '');
    const isAlreadyInState = tags.some((t) => t === formattedTagName);
    if (isAlreadyInState || !formattedTagName) {
      setTagInputValue('');
      return;
    }
    setTags([...tags, formattedTagName]);
    setTagInputValue('');
  };

  const { data: hintTags } = useSearchTagQuery(tagInputValue);

  const filteredTags = hintTags?.filter((tag) => tag !== tagInputValue) || [];

  const hintTagsWithInputValue =
    hintTags && tagInputValue ? [tagInputValue, ...filteredTags] : hintTags;

  const { inputProps, selectedItemIndex, suggestionData, wrapperProps } =
    useSuggestionList({ data: hintTagsWithInputValue, onSelect: addTag });

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'Enter':
        e.preventDefault();
        break;
      case ' ':
        addTag(tagInputValue);
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
    <div className="relative flex-grow flex" {...wrapperProps}>
      <input
        className="text-md w-[100px] flex-grow dark:bg-primary-dark-200 h-8 dark:placeholder:text-primary-dark-600"
        placeholder={tags.length ? 'Add another...' : 'Add tag'}
        value={tagInputValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        {...inputProps}
      />

      <div className="absolute top-full left-0 z-[10] w-full rounded-br-md rounded-bl-md overflow-hidden shadow-lg">
        {suggestionData.map((tag, index) => (
          <div
            onClick={() => addTag(tag)}
            key={tag}
            className={clsx([
              'p-3 bg-white fle flex-col cursor-pointer hover:bg-blue-50 dark:bg-primary-dark-200 hover:dark:bg-primary-dark-300',
              selectedItemIndex === index &&
                'bg-primary-100 dark:bg-primary-dark-300',
            ])}
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostTagsInput;
