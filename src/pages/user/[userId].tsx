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
import Filters from '@/components/user-profile/profile-filters';
import { FilterData } from '@/components/user-profile/types';

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

    router.replace(
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

  const filters: FilterData[] = [
    {
      id: '1',
      filterName: undefined,
      displayName: 'posts & shares',
    },
    {
      id: '2',
      filterName: 'images',
      displayName: 'images',
    },
    {
      id: '3',
      filterName: 'likes',
      displayName: 'likes',
    },
  ];

  return (
    <Layout>
      <UserProfileHero userDetails={userDetails} />
      <Filters filters={filters} />
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
          <ProfileSettings handleCloseModal={closeModal} />
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
