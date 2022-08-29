import clsx from "clsx";
import Image from "next/image";
import { PostDetailsType } from "@/types/index";
import {
  useRemovePostMutation,
  useToggleBookmarkMutation,
  useTogglePostLikeMutation,
} from "src/hooks/mutation";
import React, { useState } from "react";
import ModalWrapper from "../common/modal-wrapper";
import PostInput from "../post-input/post-input";
import { useSession } from "next-auth/react";

import BookmarkIcon from "@/components/common/icons/bookmark";
import BookmarkEmptyIcon from "@/components/common/icons/bookmark-empty";
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

  return (
    <>
      <div className="flex items-center mt-5">
        <div
          className={clsx([
            "flex items-center cursor-pointer w-fit hover:opacity-80 transition-opacity",
            post.likedByMe && "text-red-500",
          ])}
          onClick={handleToggleLike}
        >
          {post.likedByMe ? <HeartIcon /> : <HeartEmptyIcon />}
          {/* <Image
            src="/icons/hart.png"
            width="20"
            height="20"
            layout="fixed"
            alt=""
            unoptimized
          /> */}
          <p className="ml-2">{post.likesCount}</p>
        </div>
        <div
          className="flex items-center cursor-pointer w-fit opacity-80 ml-5 hover:opacity-50 transition-opacity"
          onClick={toggleIsSharing}
        >
          {/* <Image
            src="/icons/replay.png"
            width="20"
            height="20"
            layout="fixed"
            alt=""
            unoptimized
          /> */}
          <ShareIcon />
          <p className="ml-2">{post.sharesCount}</p>
        </div>
        <div
          className="flex items-center cursor-pointer w-fit opacity-80 ml-5 hover:opacity-50 transition-opacity"
          onClick={handleToggleBookmark}
        >
          {post.bookmarkedByMe ? <BookmarkIcon /> : <BookmarkEmptyIcon />}

          {/* <Image
            className="icon"
            src={
              post.bookmarkedByMe ? "/icons/test.svg" : "/icons/bookmark.svg"
            }
            width="20"
            height="20"
            layout="fixed"
            alt=""
            unoptimized
          /> */}
        </div>
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
