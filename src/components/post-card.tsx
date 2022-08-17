import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { trpc } from "src/utils/trpc";
import UserProfilePicture from "./user-profile-image";
import React from "react";

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
    bookmarkedByMe: boolean;
  };
}

const PostCard = ({ post }: PostCardProps) => {
  const utils = trpc.useContext();

  const mutation = trpc.useMutation("bookmarks.add", {
    onSuccess() {
      utils.invalidateQueries(["post.getInfiniteFeed"]);
      utils.invalidateQueries(["post.getAll"]);
      utils.invalidateQueries(["post.getById"]);
      utils.invalidateQueries(["bookmarks.getAll"]);
    },
  });

  const handleToggleBookmark = async () => {
    mutation.mutate({ postId: post.id });
  };

  const mutationToggleLike = trpc.useMutation("post.toggleLike", {
    onSuccess() {
      utils.invalidateQueries(["post.getInfiniteFeed"]);
      utils.invalidateQueries(["post.getAll"]);
      utils.invalidateQueries(["post.getById"]);
      utils.invalidateQueries(["bookmarks.getAll"]);
    },
  });

  const handleToggleLike = async (postId: string) => {
    mutationToggleLike.mutate({ postId: postId });
  };

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

      {post.images.length > 0 &&
        post.images.map((image) => (
          <div key={image.id} className="w-full h-80 relative mb-3">
            <Image
              layout="fill"
              src={image.url}
              objectFit="cover"
              className="rounded-lg"
              alt=""
            />
          </div>
        ))}
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
    </div>
  );
};

export default React.memo(PostCard);
