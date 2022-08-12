import { Comment, User } from "@prisma/client";
import clsx from "clsx";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import CommentsList from "./comments-list";
import Image from "next/image";
import MessageInput from "./message-input";
import { urlToHttpOptions } from "url";
import UserProfilePicture from "@/components/user-profile-image";

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

  const mutationToggleCommentLike = trpc.useMutation(["comment.toggleLike"], {
    onSuccess(input) {
      utils.invalidateQueries([
        "comment.getAllByPostId",
        { postId: comment.postId },
      ]);
      // console.log("input.id", input);
      // const comments = utils.getQueryData([
      //   "comment.getAllByPostId",
      //   { postId: comment.postId },
      // ]);
      // if (!comments) return;
      // utils.setQueryData(
      //   ["comment.getAllByPostId", { postId: comment.postId }],
      //   () =>
      //     comments.map((comment) => (comment.id === input.id ? input : comment))
      // );
    },
  });

  const handleLikeComment = (commentId: string) => {
    mutationToggleCommentLike.mutate({ commentId });
  };

  const toggleIsReplying = () => {
    setIsReplying(!isReplying);
  };

  const utils = trpc.useContext();

  const mutation = trpc.useMutation(["comment.add"], {
    onSuccess() {
      utils.invalidateQueries([
        "comment.getAllByPostId",
        { postId: comment.postId },
      ]);
    },
    // onSuccess(input) {
    //   const comments = utils.getQueryData([
    //     "comment.getAllByPostId",
    //     { postId: comment.postId },
    //   ]);
    //   if (!comments) return;
    //   utils.setQueryData(
    //     ["comment.getAllByPostId", { postId: comment.postId }],
    //     [...comments, input]
    //   );
    // },
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
          <p className="text-neutral-800">{comment.message}</p>
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
        </div>
      </div>
      {isReplying && <MessageInput onMessageSubmit={handleAddCommentReply} />}
    </>
  );
};

export default CommentBox;
