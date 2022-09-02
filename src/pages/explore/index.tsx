import { unstable_getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next/types';
import { authOptions } from '../api/auth/[...nextauth]';
import MainLayout from '@/components/layouts/main-layout';
import SuggestedUsersList from '@/components/explore/suggested-users-list';

const ExplorePage = () => (
  <MainLayout>
    <h1 className="font-poppins mb-10 mt-5 ">
      <p className="font-bold text-neutral-800 dark:text-primary-dark-800 text-2xl">
        Explore
      </p>
    </h1>
    <SuggestedUsersList />
  </MainLayout>
);

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

export default ExplorePage;
