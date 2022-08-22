import PostCard from "@/components/post-card";
import { trpc } from "src/utils/trpc";
import { useUserBookmarkedPostsQuery } from "src/hooks/query";
import { Fragment } from "react";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import Layout from "@/components/layout";

const Bookmarks = () => {
  const { data, isSuccess, fetchNextPage } = useUserBookmarkedPostsQuery();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (!isSuccess) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <h1 className="font-poppins mb-10 mt-5 ">
        <p className="font-bold text-neutral-800 text-2xl">Bookmarks</p>
        <p className="text-neutral-600 font-normal">discover</p>
      </h1>
      <div className="space-y-5">
        {data.pages.map((page) => (
          <Fragment key={page.nextCursor || null}>
            {page.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Fragment>
        ))}
        <div ref={ref} className="w-full h-10 bg-orange-300" />
      </div>
    </Layout>
  );
};

export default Bookmarks;
