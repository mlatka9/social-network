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
  disabled: boolean;
}

const PostLinkInput = ({
  register,
  isLinkError,
  control,
  disabled,
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
              'block  w-full text-md h-8 dark:bg-primary-dark-200 dark:placeholder:text-primary-dark-600',
              isLinkError && 'text-red-500'
            )}
            placeholder="Add link"
            disabled={disabled}
          />
        </div>
      )}

      <label
        htmlFor="link-toggle"
        className="inline-block mr-2 cursor-pointer relative focus-within:ring"
      >
        <input
          disabled={disabled}
          id="link-toggle"
          type="checkbox"
          className="mr-2 absolute w-full h-full opacity-0 cursor-pointer"
          {...register('link.isOpen')}
        />
        <LinkIcon />
      </label>
    </>
  );
};

export default PostLinkInput;
