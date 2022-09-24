import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import {
  useCommunityDetailsQuery,
  useCommunityPostsQuery,
} from 'src/hooks/query';

import PostInput from '@/components/post-input/post-input';
import PostList from '@/components/post/post-list';

import CommunityProfileHero from '@/components/community/community-profile-hero';
import Layout from '@/components/layouts/main-layout';
import TextHeader from '@/components/common/text-header';
import PostsSortPanel from '@/components/common/posts-sort-panel';
import Loading from '@/components/common/loading';
import ErrorFallback from '@/components/common/error-fallback';
import Head from 'next/head';
import { toast } from 'react-toastify';
import { authOptions } from '../api/auth/[...nextauth]';

const Community = () => {
  const router = useRouter();

  const communityId = router.query.communityId as string;
  const section = router.query.section as string | undefined;
  const sort = router.query.sort as string | undefined;
  const time = router.query.time as string | undefined;

  const {
    data: community,
    isError,
    isSuccess: isDetailsSuccess,
  } = useCommunityDetailsQuery(communityId);

  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
  } = useCommunityPostsQuery({ communityId, sort, time, enabled: !section });

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

  const addPostCallback = () => {
    toast('Your post was added successfully', {
      type: 'success',
    });
  };

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
        {isDetailsSuccess ? (
          <>
            <CommunityProfileHero community={community} />
            {community.joinedByMe && (
              <div className="bg-primary-0 dark:bg-primary-dark-200 px-5 py-3 rounded-lg mb-5">
                <TextHeader className="pb-3">Post something</TextHeader>
                <hr className="mb-3 dark:border-primary-700" />
                <PostInput
                  communityId={communityId}
                  submitCallback={addPostCallback}
                />
              </div>
            )}
          </>
        ) : (
          <div className="space-y-10 bg-primary-0 dark:bg-primary-dark-200">
            <Loading height={440} />
          </div>
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
