import { useRouter } from 'next/router';
import { useUserPostsQuery, useUserQuery } from 'src/hooks/query';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import type { GetServerSidePropsContext } from 'next';
import ProfileSettings from '@/components/common/profile-settings';
import UserFollows from '@/components/common/user-follows';
import PostList from '@/components/post/post-list';
import ModalWrapper from '@/components/common/modal-wrapper';
import Layout from '@/components/layouts/main-layout';
import UserProfileHero from '@/components/user-profile/user-profile-hero';
import ErrorFallback from '@/components/common/error-fallback';
import ProfileFilters from '@/components/user-profile/profile-filters';

const User = () => {
  const router = useRouter();

  const userId = router.query.userId as string;
  const section = router.query?.section as string | undefined;
  const filter = router.query?.filter as string | undefined;

  const { data: userDetails, isError: isUserError } = useUserQuery(userId);
  const { data, fetchNextPage, hasNextPage } = useUserPostsQuery(
    userId,
    filter
  );

  const closeModal = () => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { section, userId, ...restParams } = router.query;
    router.push(
      {
        pathname: `/user/${userId}`,
        query: { ...restParams },
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  };

  if (isUserError) {
    return (
      <Layout>
        <ErrorFallback message="This user does't exists" />
      </Layout>
    );
  }

  return (
    <Layout>
      <UserProfileHero userDetails={userDetails} />
      <ProfileFilters />
      <PostList
        data={data}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
      {(section === 'followers' || section === 'following') && (
        <ModalWrapper title="Followers" handleCloseModal={closeModal}>
          <UserFollows section={section} userId={userId} />
        </ModalWrapper>
      )}

      {section === 'settings' && (
        <ModalWrapper title="Settings" handleCloseModal={closeModal}>
          <ProfileSettings />
        </ModalWrapper>
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

export default User;
