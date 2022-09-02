import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import {
  useCommunityDetailsQuery,
  useCommunityPostsQuery,
} from 'src/hooks/query';
import { authOptions } from '../api/auth/[...nextauth]';
import PostInput from '@/components/post-input/post-input';
import PostList from '@/components/post/post-list';

import CommunityProfileHero from '@/components/community/community-profile-hero';
import Layout from '@/components/layouts/main-layout';
import TextHeader from '@/components/common/text-header';
import PostsSortPanel from '@/components/common/posts-sort-panel';
import Loading from '@/components/common/loading';
import ErrorFallback from '@/components/common/error-fallback';

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
      <Layout>
        <ErrorFallback message="This community does't exists" />
      </Layout>
    );
  }

  return (
    <Layout>
      {isDetailsSuccess ? (
        <>
          <CommunityProfileHero community={community} />
          {community.joinedByMe && (
            <div className="bg-primary-0 dark:bg-primary-dark-100 px-5 py-3 rounded-lg mb-5">
              <TextHeader className="pb-3">Post something</TextHeader>
              <hr className="mb-3" />
              <PostInput communityId={communityId} />
            </div>
          )}
        </>
      ) : (
        <div className="space-y-10">
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
