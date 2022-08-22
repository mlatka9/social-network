import CommentsList from "@/components/comments-list";
import PostCard from "@/components/post-card";
import MessageInput from "@/components/message-input";
import { usePost, usePostComments } from "src/hooks/query";
import { useAddCommentMutation } from "src/hooks/mutation";
import UserProfilePicture from "./user-profile-image";
import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";
import { trpc } from "src/utils/trpc";

interface PostDetailsProps {
  postId: string;
}

const PostDetails = ({ postId }: PostDetailsProps) => {
  const { data: post, isError, isSuccess } = usePost(postId);

  const postComments = usePostComments(postId);
  const addComment = useAddCommentMutation(postId);

  const handleAddComment = (message: string) => {
    addComment({
      message: message,
      parentId: null,
    });
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
    mutation.mutate({ postId });
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

  if (isError) {
    return <div>Error...</div>;
  }

  if (!isSuccess) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="bg-white w-full rounded-lg grid grid-cols-2 gap-x-10">
        <div className="row-span-2">
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
              <Link key={tag.name} href={`/tag/${tag.name}`} passHref>
                <div
                  className="bg-orange-600 text-white rounded-md p-1 mr-2 flex items-center cursor-pointer"
                  style={{ backgroundColor: tag.color }}
                >
                  <span className="text-sm">#{tag.name}</span>
                </div>
              </Link>
            ))}
          </div>

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
                    src={image.url}
                    objectFit="cover"
                    className="rounded-lg"
                    alt=""
                  />
                </div>
              ))}
          </div>

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
        <div className="overflow-y-scroll max-h-[calc(100vh-300px)]">
          {postComments.isSuccess && (
            <CommentsList comments={postComments.data} />
          )}
        </div>
        <div className="col-start-2">
          <MessageInput onMessageSubmit={handleAddComment} />
        </div>
      </div>
    </>
  );
};

export default PostDetails;
