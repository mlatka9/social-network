import type { GetServerSidePropsContext, NextPage } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import PostInput from "@/components/post-input/post-input";
import React from "react";
import { useInfiniteFeedQuery } from "src/hooks/query";
import Layout from "@/components/common/layout";
import PostList from "@/components/post/post-list";

const Home: NextPage = () => {
  const { data, fetchNextPage, isSuccess } = useInfiniteFeedQuery();

  if (!isSuccess) {
    return <div>loading...</div>;
  }

  return (
    <>
      <Layout>
        <PostInput />
        <div className="mb-5" />
        <PostList data={data} fetchNextPage={fetchNextPage} />
      </Layout>
    </>
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

export default Home;
