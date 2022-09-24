import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import Layout from '@/components/layouts/main-layout';
import PostDetails from '@/components/post/post-details';
import usePost from '@/components/post/use-post';

const PostPage = () => {
  const { postId } = usePost();

  return (
    <>
      <Head>
        <title>Post</title>
        <meta property="og:title" content="Post" />
      </Head>
      <Layout>
        <div className="p-5 bg-white rounded-lg dark:bg-primary-dark-200 ">
          <PostDetails postId={postId} />
        </div>
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
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}

export default PostPage;
