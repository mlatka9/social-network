import { trpc } from "src/utils/trpc";
import PostCard from "@/components/post-card";
import { useUserPostsQuery } from "src/hooks/query";
import { useInView } from "react-intersection-observer";
import { useEffect, Fragment } from "react";

interface PostListProps {
  userId: string;
}

const PostList = ({ userId }: PostListProps) => {
  const { ref, inView } = useInView();
  const { data, isSuccess, fetchNextPage } = useUserPostsQuery(userId);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <div className="space-y-5 mb-10">
      {isSuccess &&
        data.pages.map((page) => (
          <Fragment key={page.nextCursor || "page"}>
            {page.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Fragment>
        ))}
      <div ref={ref} className="w-full h-10 bg-orange-300" />
    </div>
  );
};

export default PostList;
