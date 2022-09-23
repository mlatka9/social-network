import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useState } from 'react';
import CommunityLayout from '@/components/layouts/community-layout';
import CommunityFilter from '@/components/community/community-filter';
import Button from '@/components/common/button';
import CategoryList from '@/components/community/categories-list';
import ModalWrapper from '@/components/common/modal-wrapper';
import CommunityCreator from '@/components/community/community-creator';
import BackButton from '@/components/common/back-button';
import CommunityList from '@/components/community/community-list';
import Head from 'next/head';
import { authOptions } from '../api/auth/[...nextauth]';

const CommunitiesPage = () => {
  const [isCommunityCreatorOpen, setIsCommunityCreatorOpen] = useState(false);

  const handleCloseCreator = () => {
    setIsCommunityCreatorOpen(false);
  };

  const handleOpenCreator = () => {
    setIsCommunityCreatorOpen(true);
  };

  return (
    <>
      <Head>
        <title>Communities</title>
        <meta property="og:title" content="Communities" />
      </Head>

      <CommunityLayout>
        <div className="hidden lg:block sticky h-fit top-[92px] space-y-5">
          <BackButton />
          <CategoryList />
          <Button className="w-full" onClick={handleOpenCreator}>
            Create community
          </Button>
        </div>

        <div className="mx-auto lg:mx-0 w-full">
          <div className="lg:hidden ">
            <Button
              className="fixed bottom-2 right-2 rounded-full w-min text-sm shadow-lg"
              onClick={handleOpenCreator}
            >
              Create community
            </Button>
            <CategoryList />
            <div className="mb-2" />
          </div>
          <CommunityFilter />
          <CommunityList />
        </div>

        {isCommunityCreatorOpen && (
          <ModalWrapper
            handleCloseModal={handleCloseCreator}
            title="Create community"
          >
            <CommunityCreator handleCloseCreator={handleCloseCreator} />
          </ModalWrapper>
        )}
      </CommunityLayout>
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

export default CommunitiesPage;
