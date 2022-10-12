import type { GetServerSidePropsContext, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import React from 'react';
import MainLayout from '@/components/layouts/main-layout';
import PostList from '@/components/post/post-list';
import ModalWrapper from '@/components/common/modal-wrapper';
import PostDetails from '@/components/post/post-details';
import PostsSortPanel from '@/components/common/posts-sort-panel';
import Head from 'next/head';
import useHome from '@/components/home/use-home';
import HomeFallbackCard from '@/components/home/home-fallback-card';
import HomePostIput from '@/components/home/home-post-input';
import { authOptions } from './api/auth/[...nextauth]';

const Home: NextPage = () => {
  const {
    closeShowcasedPost,
    data,
    fetchNextPage,
    hasNextPage,
    showcasedPostId,
    isPostsNotExists,
  } = useHome();

  return (
    <>
      <Head>
        <title>Social Network</title>
        <meta property="og:title" content="Twitterek" />
      </Head>
      <MainLayout>
        <HomePostIput />
        <PostsSortPanel pathname="/" />
        {isPostsNotExists ? (
          <HomeFallbackCard />
        ) : (
          <PostList
            data={data}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
          />
        )}
      </MainLayout>
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
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}

export default Home;
