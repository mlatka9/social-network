import { unstable_getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next/types';
import SuggestedUsersList from '@/components/explore/suggested-users-list';
import SuggestedCommunitiesList from '@/components/explore/suggested-communities-list';
import FallbackCard from '@/components/common/fallback-card';
import ExploreLayout from '@/components/layouts/explore-layout';
import Head from 'next/head';
import useExplore from '@/components/explore/use-explore';
import { authOptions } from '../api/auth/[...nextauth]';

const ExplorePage = () => {
  const { isNotExploreData } = useExplore();

  return (
    <>
      <Head>
        <title>Explore</title>
        <meta property="og:title" content="Explore" />
      </Head>
      <ExploreLayout>
        <h1 className="font-poppins mb-10 mt-5 ">
          <p className="font-bold text-neutral-800 dark:text-primary-dark-800 text-2xl">
            Explore
          </p>
        </h1>

        {isNotExploreData ? (
          <FallbackCard>
            Our community still grow. We&apos;ll have something for you soon 😉
          </FallbackCard>
        ) : (
          <>
            <SuggestedUsersList />
            <div className="mt-10" />
            <SuggestedCommunitiesList />
          </>
        )}
      </ExploreLayout>
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

export default ExplorePage;
