import clsx from "clsx";
import Image from "next/image";
import { trpc } from "src/utils/trpc";
import { PostDetailsType } from "@/types/index";
import {
  useToggleBookmarkMutation,
  useTogglePostLikeMutation,
} from "src/hooks/mutation";

interface PostCardFooterProps {
  post: PostDetailsType;
}

const PostCardFooter = ({ post }: PostCardFooterProps) => {
  const toggleBookmark = useToggleBookmarkMutation();
  const togglePostLike = useTogglePostLikeMutation();

  const handleToggleBookmark = async () => {
    toggleBookmark({ postId: post.id });
  };

  const handleToggleLike = async (postId: string) => {
    togglePostLike({ postId: postId });
  };

  useTogglePostLikeMutation();

  return (
    <div className="flex items-center">
      <div
        className={clsx([
          "flex items-center cursor-pointer w-fit",
          post.likedByMe && "text-red-500",
        ])}
        onClick={() => handleToggleLike(post.id)}
      >
        <Image
          src="/icons/hart.png"
          width="20"
          height="20"
          layout="fixed"
          alt=""
        />
        <p className="ml-2">{post.likesCount}</p>
      </div>
      <div
        className={clsx([
          "flex items-center cursor-pointer w-fit opacity-50 ml-5",
          post.bookmarkedByMe && "opacity-100 bg-red-500",
        ])}
        onClick={handleToggleBookmark}
      >
        <Image
          src="/icons/bookmark.png"
          width="20"
          height="20"
          layout="fixed"
          alt=""
        />
      </div>
      <div className="font-medium text-xs text-gray-400 ml-auto w-fit">
        <p>{post.commentsCount} Comments</p>
      </div>
    </div>
  );
};

export default PostCardFooter;
