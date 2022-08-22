import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { unstable_getServerSession } from "next-auth/next";
import { useRouter } from "next/router";
import CommentsList from "../../components/comments-list";
import PostCard from "@/components/post-card";
import MessageInput from "@/components/message-input";
import { authOptions } from "src/pages/api/auth/[...nextauth]";
import { usePostsWithTagQuery } from "src/hooks/query";
import { useAddCommentMutation } from "src/hooks/mutation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Fragment } from "react";
import Layout from "@/components/layout";

const TagPage = () => {
  const { query } = useRouter();

  const tagName = query.tagName as string;
  const { data, fetchNextPage, isSuccess } = usePostsWithTagQuery(tagName);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <Layout>
      <h1 className="font-poppins mb-10 mt-5 ">
        <p className="font-bold text-neutral-800 text-2xl">#{tagName}</p>
        <p className="text-neutral-600 font-normal">discover</p>
      </h1>
      <div className="space-y-5">
        {isSuccess &&
          data.pages.map((page) => (
            <Fragment key={page.nextCursor || ""}>
              {page.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Fragment>
          ))}
      </div>
      <div ref={ref} className="w-full h-10 bg-orange-300" />
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}

export default TagPage;
