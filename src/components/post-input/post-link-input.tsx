import { Control, UseFormRegister, useWatch } from 'react-hook-form';
import clsx from 'clsx';
import LinkIcon from '../common/icons/link';
import { PostInputFormType } from './types';

const URL_REGEX =
  /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const isUrlValid = (url: string) => URL_REGEX.test(url);

interface PostLinkInputProps {
  register: UseFormRegister<PostInputFormType>;
  isLinkError: boolean;
  control: Control<PostInputFormType>;
}

const PostLinkInput = ({
  register,
  isLinkError,
  control,
}: PostLinkInputProps) => {
  const { isOpen } = useWatch({
    control,
    name: 'link',
    defaultValue: { value: '', isOpen: false },
  });

  const isLinkInputValid = (value: string | undefined) => {
    if (!value || !isOpen) return true;
    return isUrlValid(value);
  };

  return (
    <>
      {isOpen && (
        <div className="mb-2">
          <input
            {...register('link.value', {
              validate: (value) => isLinkInputValid(value),
            })}
            className={clsx(
              'block  w-full text-md h-8',
              isLinkError && 'text-red-500'
            )}
            placeholder="Add link"
          />
        </div>
      )}

      <label htmlFor="link-toggle" className="inline-block mr-2 cursor-pointer">
        <input
          id="link-toggle"
          type="checkbox"
          className="mr-2 hidden"
          {...register('link.isOpen')}
        />
        <LinkIcon />
      </label>
    </>
  );
};

export default PostLinkInput;
