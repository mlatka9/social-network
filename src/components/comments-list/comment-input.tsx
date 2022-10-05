import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Button from '../common/button';

interface CommentInputProps {
  onMessageSubmit: (message: string) => void;
}

const CommentInput = ({ onMessageSubmit }: CommentInputProps) => {
  const { data } = useSession();
  const [commentMessageValue, setCommentMessageValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const submitDisabled = !commentMessageValue.length;

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitDisabled) return;
    onMessageSubmit(commentMessageValue);
    setCommentMessageValue('');
  };

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = '0px';
    const { scrollHeight } = textareaRef.current;
    textareaRef.current.style.height = `${scrollHeight}px`;
  }, [commentMessageValue]);

  const me = data?.user!;

  return (
    <form
      className="w-full flex rounded-lg my-5 relative"
      onSubmit={handleOnSubmit}
    >
      <div className="shrink-0 w-10 h-10 relative mr-3">
        <Image
          src={me.image || '/images/avatar-fallback.svg'}
          width="40"
          height="40"
          layout="fixed"
          alt=""
          className="rounded-lg"
          objectFit="cover"
        />
      </div>

      <textarea
        ref={textareaRef}
        placeholder="Add your comment"
        className="bg-blue-50 dark:bg-primary-dark-100 w-full rounded-lg placeholder:text-sm pl-2 pr-20 bg-transparent pt-3 h-10 max-h-40 min-h-[40px]"
        value={commentMessageValue}
        onChange={({ target }) => setCommentMessageValue(target.value)}
      />
      <Button
        type="submit"
        className="self-center absolute right-1 bottom-1"
        isSmall
        disabled={submitDisabled}
      >
        Submit
      </Button>
    </form>
  );
};

export default CommentInput;
