import type { GetServerSidePropsContext, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import React from 'react';
import { useRouter } from 'next/router';
import { useInfiniteFeedQuery } from 'src/hooks/query';
import { toast } from 'react-toastify';
import PostInput from '@/components/post-input/post-input';
import Layout from '@/components/layouts/main-layout';
import PostList from '@/components/post/post-list';
import ModalWrapper from '@/components/common/modal-wrapper';
import PostDetails from '@/components/post/post-details';
import TextHeader from '@/components/common/text-header';
import PostsSortPanel from '@/components/common/posts-sort-panel';
import Link from 'next/link';
import HashIcon from '@/components/common/icons/hash';
import { authOptions } from './api/auth/[...nextauth]';

const Home: NextPage = () => {
  const router = useRouter();
  const showcasedPostId = router.query.postId as string | undefined;
  const sort = router.query.sort as string | undefined;
  const time = router.query.time as string | undefined;

  const closeShowcasedPost = () => {
    const { postId, ...restParams } = router.query;
    router.push(
      {
        pathname: '/',
        query: { ...restParams },
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  };
  const { data, fetchNextPage, hasNextPage } = useInfiniteFeedQuery({
    sort,
    time,
  });

  const addPostCallback = () => {
    toast('Your post was added successfully', {
      type: 'success',
    });
  };

  return (
    <>
      <Layout>
        <div className="bg-primary-0 dark:bg-primary-dark-200 px-5 py-3 rounded-lg mt-3 lg:mt-0">
          <TextHeader className="pb-3">Post something</TextHeader>
          <hr className="mb-3 dark:border-primary-700" />
          <PostInput submitCallback={addPostCallback} />
        </div>

        <div className="mb-5" />
        <PostsSortPanel pathname="/" />

        <PostList
          data={data}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
        />
        {!data?.pages[0]?.posts.length && (
          <div className="bg-primary-0 dark:bg-primary-dark-200 p-3 rounded-xl text-primary-500 dark:text-primary-dark-700 flex items-center min-h-[100px] text-lg">
            <Link href="/explore">
              <a className="text-blue-500 font-bold mr-1 group relative flex items-center font-poppins">
                <HashIcon className="fill-blue-500" />
                <span>Explore</span>
                <div className="group-hover:opacity-100 opacity-0 w-full h-[3px] bg-blue-500 transition-opacity duration-100 absolute bottom-0" />
              </a>
            </Link>
            and find something for you
          </div>
        )}
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
