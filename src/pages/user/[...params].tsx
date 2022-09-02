import { useRouter } from 'next/router';
import { useUserPostsQuery } from 'src/hooks/query';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import type { GetServerSidePropsContext } from 'next';
import ProfileSettings from '@/components/common/profile-settings';
import UserFollows from '@/components/common/user-follows';
import PostList from '@/components/post/post-list';
import ModalWrapper from '@/components/common/modal-wrapper';
import Layout from '@/components/layouts/main-layout';
import UserProfileHero from '@/components/user-profile/user-profile-hero';

const User = () => {
  const router = useRouter();

  const userId = router.query.params?.[0]!;
  const section = router.query.params?.[1];

  const { data, fetchNextPage, hasNextPage } = useUserPostsQuery(userId);

  const closeModal = () => {
    router.push(`/user/${userId}`, undefined, { shallow: true });
  };

  if (!userId) return <div>no user id</div>;

  return (
    <Layout>
      <UserProfileHero />
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
