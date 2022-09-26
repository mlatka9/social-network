import Image from 'next/image';
import { Control, useWatch, UseFormSetValue } from 'react-hook-form';
import { PostInputFormType } from './types';

interface SelectedTagsListProps {
  control: Control<PostInputFormType>;
  setValue: UseFormSetValue<PostInputFormType>;
  disabled: boolean;
}

const SelectedTagsList = ({
  control,
  setValue,
  disabled,
}: SelectedTagsListProps) => {
  const tags = useWatch({ control, name: 'tags', defaultValue: [] });

  const handleRemoveTag = (name: string) => {
    setValue(
      'tags',
      tags.filter((tag) => tag !== name)
    );
  };

  return (
    <>
      {tags.map((tag) => (
        <div
          className=" text-white rounded-md p-1 mr-2 flex items-center bg-blue-400"
          key={tag}
        >
          <span>#{tag}</span>
          {!disabled && (
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 justify-center flex items-center shrink-0 w-4 h-4"
            >
              <Image src="/icons/close.png" height="16" width="16" alt="" />
            </button>
          )}
        </div>
      ))}
    </>
  );
};

export default SelectedTagsList;
