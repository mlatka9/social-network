import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
import Button from '../common/button';

interface CommentInputProps {
  onMessageSubmit: (message: string) => void;
}

const CommentInput = ({ onMessageSubmit }: CommentInputProps) => {
  const { data } = useSession();
  const [commentMessageValue, setCommentMessageValue] = useState('');

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onMessageSubmit(commentMessageValue);
    setCommentMessageValue('');
  };

  const me = data?.user!;

  return (
    <form
      className="w-full flex rounded-lg my-5 relative dark:bg-primary-dark-100 bg-blue-50"
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

      <input
        placeholder="Add your comment"
        className="w-full rounded-lg placeholder:text-sm pl-2 pr-20 bg-transparent"
        value={commentMessageValue}
        onChange={({ target }) => setCommentMessageValue(target.value)}
      />
      <Button type="submit" className="self-center absolute right-1" isSmall>
        Submit
      </Button>
    </form>
  );
};

export default CommentInput;
