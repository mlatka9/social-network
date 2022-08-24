import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import PostDetails from "../post/post-details";
import ModalWrapper from "../common/modal-wrapper";
import Author from "./author";
import TagsList from "./tags-list";
import ImagesGrid from "./images-grid";
import { PostDetailsType } from "@/types/index";
import PostCardFooter from "./post-card-footer";
import PostInput from "../post-input/post-input";
import PostThumbnail from "../post/post-thumbnail";
import { usePostQuery } from "src/hooks/query";
import { useElementSize } from "usehooks-ts";

export interface PostCardProps {
  post: PostDetailsType;
}

const PostCard = ({ post }: PostCardProps) => {
  const router = useRouter();

  const { data: parentPost, isSuccess } = usePostQuery(
    post.shareParentId || undefined
  );

  const showModalOnClick = router.asPath === "/";

  const goToPostDetails = () => {
    const url = showModalOnClick
      ? `${router.asPath}?postId=${post.id}`
      : `/post/${post.id}`;
    router.push(url, `/post/${post.id}`, {
      shallow: true,
      scroll: showModalOnClick ? false : true,
    });
  };

  const goToSharedPost = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    router.push(`/post/${post.shareParentId}`);
  };

  const [postContentRef, { height }] = useElementSize();

  return (
    <article
      className="bg-white w-full p-5 shadow-sm rounded-lg cursor-pointer"
      onClick={goToPostDetails}
    >
      <Author
        authorId={post.user.id}
        authorImage={post.user.image}
        authorName={post.user.name}
        postCreatedAt={post.createdAt}
      />
      <div className="ml-14">
        <TagsList tags={post.tags} />
        <div className="relative">
          <div className="max-h-[600px] overflow-hidden" ref={postContentRef}>
            <p className="mb-3">{post.content}</p>
            <ImagesGrid images={post.images} />
            {isSuccess && (
              <>
                <div className="mt-3 h-1" />
                <PostThumbnail
                  sharedPost={parentPost}
                  onClick={goToSharedPost}
                />
              </>
            )}
          </div>
          {height === 600 && (
            <div className="bg-gradient-to-t from-white to-white/0 absolute h-5 w-full bottom-0 flex items-center justify-center text-white" />
          )}
        </div>

        <PostCardFooter post={post} />
      </div>
    </article>
  );
};

export default React.memo(PostCard);
