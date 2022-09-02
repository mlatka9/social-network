import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import CommunityList from '@/components/community/community-list';
import Layout from '@/components/layouts/community-layout';

const CommunitiesPage = () => (
  <Layout>
    <CommunityList />
  </Layout>
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

export default CommunitiesPage;
