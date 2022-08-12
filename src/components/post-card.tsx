import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { trpc } from "src/utils/trpc";
import UserProfilePicture from "./user-profile-image";

const postWithUserAndImages = Prisma.validator<Prisma.PostArgs>()({
  include: { images: true, user: true },
});

type PostWithUserAndImages = Prisma.PostGetPayload<
  typeof postWithUserAndImages
>;

interface PostCardProps {
  post: PostWithUserAndImages & {
    likedByMe: boolean;
    commentsCount: number;
    likesCount: number;
  };
  handleToggleLike: (postId: string) => void;
}

const PostCard = ({ post, handleToggleLike }: PostCardProps) => {
  return (
    <div className="bg-white w-full p-5 shadow-sm rounded-lg">
      <div className="flex">
        <UserProfilePicture
          imageUrl={post.user.image || ""}
          userID={post.userId}
        />
        <div className="ml-4">
          <p className="font-medium">{post.user.name}</p>
          <p className="font-medium text-xs text-gray-400">
            {post.createdAt.toDateString()}
          </p>
        </div>
      </div>
      <div className="py-5">
        <Link key={post.id} href={`/post/${post.id}`} passHref>
          <a>{post.content}</a>
        </Link>
      </div>

      {post.images[0]?.url && (
        <div className="w-full h-80 relative mb-3">
          <Image
            layout="fill"
            src={post.images[0]?.url || ""}
            objectFit="cover"
            className="rounded-lg"
            alt=""
          />
        </div>
      )}

      <div className="font-medium text-xs text-gray-400 ml-auto w-fit">
        <p>{post.commentsCount} Comments</p>
      </div>
      <div
        className={clsx([
          "flex items-center cursor-pointer w-fit",
          post.likedByMe && "text-red-500",
        ])}
        onClick={() => handleToggleLike(post.id)}
      >
        <Image src="/icons/hart.png" width="20" height="20" layout="fixed" />
        <p className="ml-2">{post.likesCount}</p>
      </div>
    </div>
  );
};

export default PostCard;
