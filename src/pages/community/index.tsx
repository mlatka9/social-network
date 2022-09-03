import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { authOptions } from '../api/auth/[...nextauth]';
import CommunityLayout from '@/components/layouts/community-layout';
import { useCommunitiesQuery } from '@/hooks/query';
import CommunityFilter from '@/components/community/community-filter';
import CommunityCard from '@/components/community/community-card';
import Button from '@/components/common/button';
import CategoryList from '@/components/community/categories-list';
import ModalWrapper from '@/components/common/modal-wrapper';
import CommunityCreator from '@/components/community/community-creator';
import Loading from '@/components/common/loading';
import CategoriesListHorizontal from '@/components/community/categories-list-horizontal';

const CommunitiesPage = () => {
  const router = useRouter();

  const [isCommunityCreatorOpen, setIsCommunityCreatorOpen] = useState(false);

  const category = router.query.category as string | undefined;
  const filter = router.query.filter as string | undefined;

  const { data, isSuccess } = useCommunitiesQuery(category, filter);

  const goToCommunity = (communityId: string) => {
    router.push(`/community/${communityId}`);
  };

  const handleCloseCreator = () => {
    setIsCommunityCreatorOpen(false);
  };

  const handleOpenCreator = () => {
    setIsCommunityCreatorOpen(true);
  };

  return (
    <CommunityLayout>
      <div className="hidden lg:block sticky h-fit top-[92px] space-y-5">
        <Button className="w-full" onClick={handleOpenCreator}>
          Create community
        </Button>
        <CategoryList />
      </div>

      <div className="">
        <div className="lg:hidden">
          <Button className="w-full mb-2" onClick={handleOpenCreator}>
            Create community
          </Button>
          <CategoriesListHorizontal />
          <div className="mb-2" />
        </div>
        <CommunityFilter />
        {isSuccess ? (
          <main className="space-y-3">
            {data.map((community) => (
              <div
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.target !== e.currentTarget) return;
                  if (e.code === 'Enter') {
                    goToCommunity(community.id);
                  }
                }}
                onClick={() => goToCommunity(community.id)}
                key={community.id}
                className="cursor-pointer"
              >
                <CommunityCard
                  isMyfavourite={community.isMyfavourite}
                  id={community.id}
                  isOwner={community.isOwner}
                  joinedByMe={community.joinedByMe}
                  categoryName={community.category.name}
                  description={community.description}
                  image={community.image}
                  membersCount={community.membersCount}
                  name={community.name}
                />
              </div>
            ))}
          </main>
        ) : (
          <div className="space-y-3">
            <Loading height={600} />
          </div>
        )}
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
