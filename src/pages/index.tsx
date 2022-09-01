import type { GetServerSidePropsContext, NextPage } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import PostInput from "@/components/post-input/post-input";
import React from "react";
import { useInfiniteFeedQuery } from "src/hooks/query";
import Layout from "@/components/layouts/main-layout";
import PostList from "@/components/post/post-list";
import { useRouter } from "next/router";
import ModalWrapper from "@/components/common/modal-wrapper";
import PostDetails from "@/components/post/post-details";
import Header from "@/components/header/header";
import TextHeader from "@/components/common/text-header";
import PostsSortPanel from "@/components/common/posts-sort-panel";

const Home: NextPage = () => {
  const router = useRouter();
  const showcasedPostId = router.query.postId as string | undefined;
  const sort = router.query.sort as string | undefined;
  const time = router.query.time as string | undefined;

  const closeShowcasedPost = () => {
    const { postId, ...restParams } = router.query;
    router.push(
      {
        pathname: "/",
        query: { ...restParams },
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  };
  const { data, fetchNextPage, isSuccess, hasNextPage } = useInfiniteFeedQuery({
    sort,
    time,
  });

  if (!isSuccess) {
    return <div>loading...</div>;
  }

  return (
    <>
      <Layout>
        <div className="bg-primary-0 dark:bg-primary-dark-100 px-5 py-3 rounded-lg">
          <TextHeader className="pb-3">Post something</TextHeader>
          <hr className="mb-3" />
          <PostInput />
        </div>

        <div className="mb-5" />
        <PostsSortPanel pathname={`/`} />
        <PostList
          data={data}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
        />
      </Layout>
      {showcasedPostId && (
        <ModalWrapper title="Post" handleCloseModal={closeShowcasedPost} isBig>
          <PostDetails postId={showcasedPostId!} />
        </ModalWrapper>
      )}
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
