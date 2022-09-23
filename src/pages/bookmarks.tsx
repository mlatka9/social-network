import { useUserBookmarkedPostsQuery } from 'src/hooks/query';
import { unstable_getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import Layout from '@/components/layouts/main-layout';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import PostList from '@/components/post/post-list';
import FallbackCard from '@/components/common/fallback-card';

const Bookmarks = () => {
  const { data, fetchNextPage, hasNextPage, isSuccess } =
    useUserBookmarkedPostsQuery();

  return (
    <Layout>
      <h1 className="font-poppins mb-10 mt-5 ">
        <p className="font-bold text-neutral-800 dark:text-primary-dark-800 text-2xl">
          Bookmarks
        </p>
        <p className="text-neutral-600 dark:text-primary-dark-700 font-normal">
          discover
        </p>
      </h1>
      <PostList
        data={data}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
      {isSuccess && !data?.pages[0]?.posts.length && (
        <FallbackCard>All your booksmarks will be there 😉</FallbackCard>
      )}
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
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Bookmarks;
