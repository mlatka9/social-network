import { useState } from "react";
import UserProfilePicture from "../common/user-profile-image";
import { useSession } from "next-auth/react";

interface CommentInputProps {
  onMessageSubmit: (message: string) => void;
}

const CommentInput = ({ onMessageSubmit }: CommentInputProps) => {
  const { data } = useSession();
  const [commentMessageValue, setCommentMessageValue] = useState("");

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onMessageSubmit(commentMessageValue);
    setCommentMessageValue("");
  };

  const me = data?.user!;

  return (
    <form className="w-full flex  rounded-lg my-5 " onSubmit={handleOnSubmit}>
      <div className="shrink-0 w-10 h-10 relative mr-3">
        <UserProfilePicture imageUrl={me.image} userID={me.id} />
      </div>

      <input
        placeholder="Add your comment"
        className="bg-blue-50 w-full rounded-lg placeholder:text-sm pl-2 dark:bg-primary-dark-200"
        value={commentMessageValue}
        onChange={({ target }) => setCommentMessageValue(target.value)}
      />
    </form>
  );
};

export default CommentInput;
