import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import type { GetServerSidePropsContext } from 'next';
import ProfileSettings from '@/components/user/profile-settings';
import UserFollows from '@/components/user/user-follows';
import PostList from '@/components/post/post-list';
import ModalWrapper from '@/components/common/modal-wrapper';
import Layout from '@/components/layouts/main-layout';
import UserProfileHero from '@/components/user-profile/user-profile-hero';
import ErrorFallback from '@/components/common/error-fallback';
import Filters from '@/components/user-profile/profile-filters';

import Head from 'next/head';
import useUser from '@/components/user/use-user';

const User = () => {
  const {
    closeModal,
    fetchNextPage,
    filters,
    hasNextPage,
    isUserError,
    postData,
    section,
    userDetails,
    userId,
  } = useUser();

  if (isUserError) {
    return (
      <>
        <Head>
          <title>User</title>
          <meta property="og:title" content="User" />
        </Head>
        <Layout>
          <ErrorFallback message="This user does't exists" />
        </Layout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>User</title>
        <meta property="og:title" content="User" />
      </Head>
      <Layout>
        <UserProfileHero userDetails={userDetails} />
        <Filters filters={filters} />
        <PostList
          data={postData}
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

export default User;
