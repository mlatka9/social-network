import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useState } from 'react';
import CommunityLayout from '@/components/layouts/community-layout';
import CommunityFilter from '@/components/community/community-filter';
import ModalWrapper from '@/components/common/modal-wrapper';
import CommunityCreator from '@/components/community/community-creator';
import CommunityList from '@/components/community/community-list';
import Head from 'next/head';
import DestopCategoryPanel from '@/components/community/desktop-category-panel';
import MobileCategoryPanel from '@/components/community/mobile-category-panel';
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
        <DestopCategoryPanel handleOpenCreator={handleOpenCreator} />
        <div className="mx-auto lg:mx-0 w-full">
          <MobileCategoryPanel handleOpenCreator={handleOpenCreator} />
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
