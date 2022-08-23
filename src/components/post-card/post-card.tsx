import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import PostDetails from "../post/post-details";
import ModalWrapper from "../common/modal-wrapper";
import Author from "./author";
import TagsList from "./tags-list";
import ImagesGrid from "./images-grid";
import { PostDetailsType } from "@/types/index";
import PostCardFooter from "./post-card-footer";

export interface PostCardProps {
  post: PostDetailsType;
}

const PostCard = ({ post }: PostCardProps) => {
  const router = useRouter();
  const showcasedPostId = router.query.postId as string | undefined;

  const onPostDetailsClose = () => {
    router.push(router.pathname, undefined, { scroll: false });
  };

  const showModalOnClick = router.asPath === "/";

  return (
    <>
      <div className="bg-white w-full p-5 shadow-sm rounded-lg">
        <Author
          authorId={post.user.id}
          authorImage={post.user.image}
          authorName={post.user.name}
          postCreatedAt={post.createdAt}
        />
        <TagsList tags={post.tags} />
        <Link
          href={
            showModalOnClick
              ? `${router.asPath}?postId=${post.id}`
              : `/post/${post.id}`
          }
          as={`/post/${post.id}`}
          scroll={showModalOnClick ? false : true}
        >
          <a>
            <p className="mb-3">{post.content}</p>
            <ImagesGrid images={post.images} />
          </a>
        </Link>
        <PostCardFooter post={post} />
      </div>

      {showcasedPostId === post.id && (
        <ModalWrapper title="Post" handleCloseModal={onPostDetailsClose} isBig>
          <PostDetails postId={showcasedPostId} />
        </ModalWrapper>
      )}
    </>
  );
};

export default React.memo(PostCard);
