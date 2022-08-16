import PostCard from "@/components/post-card";
import { trpc } from "src/utils/trpc";

const Bookmarks = () => {
  const utils = trpc.useContext();
  const { data, isSuccess } = trpc.useQuery(["bookmarks.getAll"]);

  const mutationToggleLike = trpc.useMutation("post.toggleLike", {
    onSuccess() {
      utils.invalidateQueries(["post.getAll"]);
    },
  });

  const handleToggleLike = async (postId: string) => {
    mutationToggleLike.mutate({ postId: postId });
  };

  if (!isSuccess) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {data.map((bookmark) => (
        <PostCard
          key={bookmark.id}
          post={bookmark}
          handleToggleLike={handleToggleLike}
        />
      ))}
    </div>
  );
};

export default Bookmarks;
