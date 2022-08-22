import { Prisma, Tag } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { trpc } from "src/utils/trpc";
import UserProfilePicture from "./user-profile-image";
import React from "react";
import { useRouter } from "next/router";
import PostDetails from "./post-details";
import ModalWrapper from "./modal-wrapper";

const postWithUserAndImages = Prisma.validator<Prisma.PostArgs>()({
  include: { images: true, user: true },
});

type PostWithUserAndImages = Prisma.PostGetPayload<
  typeof postWithUserAndImages
>;

interface PostCardProps {
  post: PostWithUserAndImages & {
    tags: Tag[];
    likedByMe: boolean;
    commentsCount: number;
    likesCount: number;
    bookmarkedByMe: boolean;
  };
}

const PostCard = ({ post }: PostCardProps) => {
  const router = useRouter();

  const selectedPostId = router.query.postId as string | undefined;

  const onPostDetailsClose = () => {
    router.push(router.pathname, undefined, { scroll: false });
  };

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
    <>
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
        <div className="flex mt-3 mb-5">
          {post.tags.map((tag) => (
            <Link key={tag.name} href={`/tag/${tag.name}`}>
              <div
                className="bg-orange-600 text-white rounded-md p-1 mr-2 flex items-center cursor-pointer"
                style={{ backgroundColor: tag.color }}
              >
                <span className="text-sm">#{tag.name}</span>
              </div>
            </Link>
          ))}
        </div>
        <Link
          key={post.id}
          href={`${router.asPath}?postId=${post.id}`}
          as={`/post/${post.id}`}
          scroll={false}
        >
          <a>
            <p className="mb-3">{post.content}</p>

            <div
              className={clsx([
                "grid  gap-3 auto-rows-[400px] mb-5",
                post.images.length > 1 && "grid-cols-2",
                post.images.length > 2 && "auto-rows-[250px]",
              ])}
            >
              {post.images.length > 0 &&
                post.images.map((image, index) => (
                  <div
                    key={image.id}
                    className={clsx(
                      "w-full h-full relative mb-3",
                      post.images.length === 3 && index === 0 && "row-span-2"
                    )}
                  >
                    <Image
                      layout="fill"
                      // width={100}
                      // height={100}
                      src={image.url}
                      objectFit="cover"
                      className="rounded-lg"
                      alt=""
                    />
                  </div>
                ))}
            </div>
          </a>
        </Link>
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
      {selectedPostId === post.id && (
        <ModalWrapper title="Post" handleCloseModal={onPostDetailsClose} isBig>
          <PostDetails postId={selectedPostId} />
        </ModalWrapper>
      )}
    </>
  );
};

export default React.memo(PostCard);
