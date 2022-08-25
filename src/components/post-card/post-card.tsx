import React from "react";
import { useRouter } from "next/router";
import Author from "./author";
import TagsList from "./tags-list";
import ImagesGrid from "./images-grid";
import { PostDetailsType } from "@/types/index";
import PostCardFooter from "./post-card-footer";
import PostThumbnail from "../post/post-thumbnail";
import { usePostQuery } from "src/hooks/query";
import { useElementSize } from "usehooks-ts";

export interface PostCardProps {
  post: PostDetailsType;
}

const PostCard = ({ post }: PostCardProps) => {
  const router = useRouter();

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

  const [postContentRef, { height }] = useElementSize();

  return (
    <article
      className="bg-white dark:bg-slate-800 w-full p-5 shadow-sm rounded-lg cursor-pointer"
      onClick={goToPostDetails}
    >
      <div className="flex">
        <Author
          authorId={post.user.id}
          authorImage={post.user.image}
          authorName={post.user.name}
          postCreatedAt={post.createdAt}
        />
      </div>
      <div className="ml-14">
        <TagsList tags={post.tags} />
        <div className="relative">
          <div className="max-h-[600px] overflow-hidden" ref={postContentRef}>
            <p className="mb-3">{post.content}</p>
            <ImagesGrid images={post.images} />
            {post.shareParent && (
              <>
                <div className="mt-3 h-1" />
                <PostThumbnail sharedPost={post.shareParent} />
              </>
            )}
          </div>
          {height === 600 && (
            <div className="bg-gradient-to-t from-white dark:from-slate-800 to-white/0 absolute h-5 w-full bottom-0 flex items-center justify-center text-white" />
          )}
        </div>

        <PostCardFooter post={post} />
      </div>
    </article>
  );
};

export default React.memo(PostCard);
