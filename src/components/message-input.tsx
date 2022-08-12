import { useState } from "react";
import { trpc } from "src/utils/trpc";
import Image from "next/image";
import UserProfilePicture from "./user-profile-image";

interface MessageInputProps {
  onMessageSubmit: (message: string) => void;
}
const MessageInput = ({ onMessageSubmit }: MessageInputProps) => {
  const [commentMessageValue, setCommentMessageValue] = useState("");

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onMessageSubmit(commentMessageValue);
    setCommentMessageValue("");
  };

  const me = trpc.useQuery(["user.me"]);

  return (
    <form
      className="w-full flex p-5 bg-white rounded-lg mb-5"
      onSubmit={handleOnSubmit}
    >
      <div className="shrink-0 w-10 h-10 relative mr-3">
        <UserProfilePicture
          imageUrl={me.data?.image || ""}
          userID={me.data?.id || ""}
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
