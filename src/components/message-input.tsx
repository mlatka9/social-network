import { useState } from "react";
import { trpc } from "src/utils/trpc";
import Image from "next/image";
import UserProfilePicture from "./user-profile-image";
import { useCurrentUserQuery } from "src/hooks/query";
import { useSession } from "next-auth/react";

interface MessageInputProps {
  onMessageSubmit: (message: string) => void;
}
const MessageInput = ({ onMessageSubmit }: MessageInputProps) => {
  const { data } = useSession();
  const [commentMessageValue, setCommentMessageValue] = useState("");

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onMessageSubmit(commentMessageValue);
    setCommentMessageValue("");
  };

  const me = data?.user;
  if (!me) return <div>Loading</div>;

  return (
    <form
      className="w-full flex bg-white rounded-lg my-5"
      onSubmit={handleOnSubmit}
    >
      <div className="shrink-0 w-10 h-10 relative mr-3">
        <UserProfilePicture
          imageUrl={me.image || "/images/fallback.svg"}
          userID={me.id}
        />
      </div>

      <input
        placeholder="Add your comment"
        className="bg-blue-50 w-full rounded-lg placeholder:text-sm pl-2"
        value={commentMessageValue}
        onChange={({ target }) => setCommentMessageValue(target.value)}
      />
    </form>
  );
};

export default MessageInput;
