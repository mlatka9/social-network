import { trpc } from "src/utils/trpc";
import PostCard from "@/components/post-card";

interface PostListProps {
  userId: string;
}

const PostList = ({ userId }: PostListProps) => {
  const userPosts = trpc.useQuery(["post.getAll", { userId }], {
    enabled: !!userId,
    retry: false,
  });

  return (
    <div className="space-y-5 mb-10">
      {userPosts.isSuccess &&
        userPosts.data.map((post) => <PostCard key={post.id} post={post} />)}
    </div>
  );
};

export default PostList;
