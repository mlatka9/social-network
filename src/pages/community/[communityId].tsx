import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import PostList from '@/components/post/post-list';
import CommunityProfileHero from '@/components/community/community-profile-hero';
import Layout from '@/components/layouts/main-layout';
import PostsSortPanel from '@/components/common/posts-sort-panel';
import ErrorFallback from '@/components/common/error-fallback';
import Head from 'next/head';
import CommunityPostInput from '@/components/community/community-post-input';
import useCommunity from '@/components/community/use-community';
import { authOptions } from '../api/auth/[...nextauth]';

const Community = () => {
  const { fetchNextPage, hasNextPage, isError, posts, community, communityId } =
    useCommunity();

  if (isError) {
    return (
      <>
        <Head>
          <title>Community</title>
          <meta property="og:title" content="Community" />
        </Head>
        <Layout>
          <ErrorFallback message="This community does't exists" />
        </Layout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>community - {community?.name}</title>
        <meta
          property="og:title"
          content={`community - ${community?.name}`}
          key="title"
        />
      </Head>
      <Layout>
        <CommunityProfileHero community={community} />
        {community?.joinedByMe && (
          <CommunityPostInput communityId={communityId} />
        )}
        <PostsSortPanel pathname={`/community/${communityId}`} />
        <PostList
          data={posts}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
        />
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
export default Community;
