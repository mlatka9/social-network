import PostCard from "@/components/post-card/post-card";
import { useInView } from "react-intersection-observer";
import { useEffect, Fragment } from "react";
import { InfiniteData } from "@tanstack/react-query";
import { PostDetailsType } from "@/types/db";

interface PostInfinityData {
  posts: PostDetailsType[];
  nextCursor: string | undefined;
}

interface PostListProps {
  data: InfiniteData<PostInfinityData> | undefined;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
}

const PostList = ({ data, fetchNextPage, hasNextPage }: PostListProps) => {
  const { ref, inView } = useInView({
    // rootMargin: "300px",
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (!data) return <div>Loading posts...</div>;

  return (
    <div className="space-y-5 mb-10">
      {data.pages.map((page) => (
        <Fragment key={page.nextCursor || "page"}>
          {page.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Fragment>
      ))}
      <div ref={ref} className="w-full h-10 " />
    </div>
  );
};

export default PostList;
