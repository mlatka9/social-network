import { useUserBookmarkedPostsQuery } from 'src/hooks/query';
import { unstable_getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import Layout from '@/components/layouts/main-layout';
import { authOptions } from './api/auth/[...nextauth]';
import PostList from '@/components/post/post-list';

const Bookmarks = () => {
  const { data, fetchNextPage, hasNextPage } = useUserBookmarkedPostsQuery();

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
