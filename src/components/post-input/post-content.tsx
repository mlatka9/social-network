import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { PostInputFormType } from './types';

interface PostContentProps {
  register: UseFormRegister<PostInputFormType>;
  content: string;
}

const PostContent = ({ register, content }: PostContentProps) => {
  const contentLength = content.trim().length;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { ref, ...rest } = register('content');

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = '0px';
    const { scrollHeight } = textareaRef.current;
    textareaRef.current.style.height = `${scrollHeight}px`;
  }, [content]);

  return (
    <div className="relative ">
      <textarea
        {...rest}
        ref={(e) => {
          ref(e);
          textareaRef.current = e;
        }}
        className="pb-5 bg-primary-100 rounded-lg w-full placeholder:text-sm pl-2 min-h-[120px] max-h-[300px] block mb-3 dark:bg-primary-dark-200"
      />
      <div
        className={clsx(
          'absolute right-3 bottom-1 font-medium text-xs text-gray-400',
          contentLength > 280 && '!text-red-500'
        )}
      >
        {contentLength} / 280
      </div>
    </div>
  );
};

export default PostContent;
