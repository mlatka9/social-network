import clsx from "clsx";
import Image from "next/image";
import { PostDetailsType } from "@/types/db";
import {
  useRemovePostMutation,
  useToggleBookmarkMutation,
  useTogglePostLikeMutation,
} from "src/hooks/mutation";
import React, { useState } from "react";
import ModalWrapper from "../common/modal-wrapper";
import PostInput from "../post-input/post-input";
import { useSession } from "next-auth/react";

import BookmarkIcon from "@/components/common/icons/bookmark-empty";
import BookmarkEmptyIcon from "@/components/common/icons/bookmark";
import ShareIcon from "@/components/common/icons/share";
import HeartIcon from "@/components/common/icons/heart";
import HeartEmptyIcon from "@/components/common/icons/heart-empty";

interface PostCardFooterProps {
  post: PostDetailsType;
}

const PostCardFooter = ({ post }: PostCardFooterProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const { data: session } = useSession();
  const me = session?.user!;

  const closeSharingModal = () => {
    setIsSharing(false);
  };

  const toggleIsSharing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSharing(!isSharing);
  };

  const toggleBookmark = useToggleBookmarkMutation();
  const togglePostLike = useTogglePostLikeMutation();
  const removePost = useRemovePostMutation();

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark({ postId: post.id });
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePostLike({ postId: post.id });
  };

  const handleRemovePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    removePost({ postId: post.id });
  };

  useTogglePostLikeMutation();

  console.log(post.bookmarkedByMe);

  return (
    <>
      <div className="flex items-center mt-5">
        <button
          className={clsx([
            "flex items-center cursor-pointer w-fit hover:opacity-80 transition-opacity",
            post.likedByMe && "text-red-500",
          ])}
          onClick={handleToggleLike}
        >
          {post.likedByMe ? <HeartIcon /> : <HeartEmptyIcon />}
          <p className="ml-2">{post.likesCount}</p>
        </button>
        <button
          className="flex items-center cursor-pointer w-fit opacity-80 ml-5 hover:opacity-50 transition-opacity"
          onClick={toggleIsSharing}
        >
          <ShareIcon />
          <p className="ml-2">{post.sharesCount}</p>
        </button>
        <button
          className="flex items-center cursor-pointer w-fit opacity-80 ml-5 hover:opacity-50 transition-opacity"
          onClick={handleToggleBookmark}
        >
          {post.bookmarkedByMe ? <BookmarkEmptyIcon /> : <BookmarkIcon />}
        </button>
        <div className="font-medium text-xs text-gray-400 ml-auto w-fit hover:underline">
          <p>{post.commentsCount} Comments</p>
        </div>
        {me.id === post.userId && (
          <button
            onClick={handleRemovePost}
            className="ml-3 font-medium text-xs text-red-400 hover:text-red-500 transition-colors"
          >
            delete
          </button>
        )}
      </div>
      {isSharing && (
        <ModalWrapper handleCloseModal={closeSharingModal} title="Share">
          <PostInput sharedPost={post} submitCallback={closeSharingModal} />
        </ModalWrapper>
      )}
    </>
  );
};

export default PostCardFooter;
