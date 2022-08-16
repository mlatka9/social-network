import { trpc } from "src/utils/trpc";
import PostCard from "@/components/post-card";

interface PostListProps {
  userId: string;
}

const PostList = ({ userId }: PostListProps) => {
  const utils = trpc.useContext();

  const userPosts = trpc.useQuery(["post.getAll", { userId }], {
    enabled: !!userId,
    retry: false,
  });

  const mutationToggleLike = trpc.useMutation("post.toggleLike", {
    onSuccess(input) {
      utils.invalidateQueries(["post.getAll", { userId: userId }]);
      //   if (!posts) return;
      //   utils.setQueryData(["post.getAll"], (posts) => {
      //     if (!posts) return [];
      //     return posts.map((post) =>
      //       post.id === input.updatedPost?.id
      //         ? { ...post, ...input.updatedPost }
      //         : post
      //     );
      //   });
    },
  });

  const handleToggleLike = async (postId: string) => {
    mutationToggleLike.mutate({ postId: postId });
  };

  return (
    <div className="space-y-5 mb-10">
      {userPosts.isSuccess &&
        userPosts.data.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            handleToggleLike={handleToggleLike}
          />
        ))}
    </div>
  );
};

export default PostList;
