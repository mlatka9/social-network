import { useEffect, useRef } from 'react';
import { UseFormRegister } from 'react-hook-form';
import LetterCounter from '../common/letter-counter';
import { PostInputFormType } from './types';

interface PostContentProps {
  register: UseFormRegister<PostInputFormType>;
  content: string;
  disabled: boolean;
}

const PostContent = ({ register, content, disabled }: PostContentProps) => {
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
        disabled={disabled}
        className="pb-5 bg-primary-100  rounded-lg w-full placeholder:text-sm pl-2 min-h-[120px] max-h-[300px] block mb-3 dark:bg-primary-dark-300"
      />
      <LetterCounter currentLength={contentLength} maxLength={280} />
    </div>
  );
};

export default PostContent;
