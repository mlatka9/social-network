import { Comment, User } from "@prisma/client";
import clsx from "clsx";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import CommentsList from "./comments-list";
import Image from "next/image";
import MessageInput from "./message-input";
import { urlToHttpOptions } from "url";
import UserProfilePicture from "@/components/user-profile-image";
import { useSession } from "next-auth/react";

export type CommentWithCountsType = Comment & {
  likedByMe: boolean;
  likeCount: number;
  repliesCount: number;
  user: User;
};

interface CommentBoxProps {
  comment: CommentWithCountsType;
}

const CommentBox = ({ comment }: CommentBoxProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [contentDraft, setContentDraft] = useState(comment.message);

  const me = trpc.useQuery(["user.me"]);

  const mutationToggleCommentLike = trpc.useMutation(["comment.toggleLike"], {
    onSuccess(input) {
      utils.invalidateQueries([
        "comment.getAllByPostId",
        { postId: comment.postId },
      ]);
    },
  });

  const handleLikeComment = (commentId: string) => {
    mutationToggleCommentLike.mutate({ commentId });
  };

  const toggleIsReplying = () => {
    setIsReplying(!isReplying);
  };

  const toggleOnEdit = () => {
    setIsEditing(!isEditing);
  };

  const utils = trpc.useContext();

  const mutationDelete = trpc.useMutation(["comment.delete"], {
    onSuccess() {
      utils.invalidateQueries([
        "comment.getAllByPostId",
        { postId: comment.postId },
      ]);
    },
  });

  const mutationUpdate = trpc.useMutation(["comment.update"], {
    onSuccess() {
      utils.invalidateQueries([
        "comment.getAllByPostId",
        { postId: comment.postId },
      ]);
    },
  });

  const deleteComment = () => {
    mutationDelete.mutate({ commentId: comment.id });
  };

  const updateComment = () => {
    mutationUpdate.mutate({ commentId: comment.id, newContent: contentDraft });
    setIsEditing(false);
  };

  const mutation = trpc.useMutation(["comment.add"], {
    onSuccess() {
      utils.invalidateQueries([
        "comment.getAllByPostId",
        { postId: comment.postId },
      ]);
    },
  });

  const handleAddCommentReply = (message: string) => {
    mutation.mutate({
      message: message,
      parentId: comment.id,
      postId: comment.postId,
    });
    setIsReplying(false);
  };

  return (
    <>
      <div className="grid grid-cols-[40px_1fr] bg-white gap-x-3 px-5 py-3 rounded-lg shadow-sm mb-3">
        <div className="w-10 h-10 relative ">
          <UserProfilePicture
            imageUrl={comment.user.image || ""}
            userID={comment.userId || ""}
          />
        </div>
        <div className="mb-5">
          <div className="flex items-baseline my-2">
            <p className="font-medium">{comment.user.name}</p>

            <p className="font-medium text-xs text-gray-400 ml-3">
              {comment.createdAt.toDateString()}
            </p>
          </div>
          {isEditing ? (
            <div className="flex flex-col">
              <textarea
                className="w-full outline-blue-100 outline rounded-md"
                value={contentDraft}
                onChange={({ target }) => setContentDraft(target.value)}
              />
              <button
                onClick={updateComment}
                className="ml-auto text-sm bg-blue-600 text-white rounded-md px-2 py-1 mt-3 hover:bg-blue-400 transition-colors"
              >
                Save
              </button>
            </div>
          ) : (
            <p className="text-neutral-800">{comment.message}</p>
          )}
        </div>
        <div className="flex col-start-2">
          <div
            className={clsx([
              "flex items-center cursor-pointer w-fit",
              comment.likedByMe && "text-red-500",
            ])}
            onClick={() => handleLikeComment(comment.id)}
          >
            <Image
              src="/icons/hart.png"
              width="20"
              height="20"
              layout="fixed"
              alt=""
            />
            <p className="ml-2">{comment.likeCount}</p>
          </div>
          <div className={clsx(["flex items-center w-fit ml-5"])}>
            <Image
              src="/icons/replay.png"
              width="20"
              height="20"
              layout="fixed"
              alt=""
            />
            <p className="ml-2">{comment.repliesCount}</p>
          </div>
          <button
            onClick={toggleIsReplying}
            className="ml-auto font-medium text-xs text-gray-400 hover:text-neutral-800 transition-colors"
          >
            Reply
          </button>
          {comment.userId === me.data?.id && (
            <>
              <button
                onClick={toggleOnEdit}
                className="ml-3 font-medium text-xs text-gray-400 hover:text-neutral-800 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={deleteComment}
                className="ml-3 font-medium text-xs text-red-400 hover:text-red-500 transition-colors"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      {isReplying && <MessageInput onMessageSubmit={handleAddCommentReply} />}
    </>
  );
};

export default CommentBox;
