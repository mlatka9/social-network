import { ReactNode, useState } from 'react';
import PopularCommunitiesList from '@/components/community/popular-communities-list';
import Header from '../header/header';
import TrendingTagsList from '@/components/common/trending-tags-list';
import CategoryList from '../community/categories-list';
import ModalWrapper from '../common/modal-wrapper';
import CommunityCreator from '../community/community-creator';
import Button from '../common/button';

interface LayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => {
  const [isCommunityCreatorOpen, setIsCommunityCreatorOpen] = useState(false);

  const handleCloseCreator = () => {
    setIsCommunityCreatorOpen(false);
  };

  const handleOpenCreator = () => {
    setIsCommunityCreatorOpen(true);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen grid grid-cols-[300px_1fr_300px] max-w-[1100px] mx-auto gap-x-5 mt-5">
        <div className="sticky h-fit top-[92px] space-y-5">
          <Button className="w-full" onClick={handleOpenCreator}>
            Create community
          </Button>
          <CategoryList />
        </div>
        <main>{children}</main>
        <div className="sticky h-fit top-[92px] space-y-5">
          <TrendingTagsList />
          <PopularCommunitiesList />
        </div>
      </div>
      {isCommunityCreatorOpen && (
        <ModalWrapper
          handleCloseModal={handleCloseCreator}
          title="Create community"
        >
          <CommunityCreator handleCloseCreator={handleCloseCreator} />
        </ModalWrapper>
      )}
    </>
  );
};

export default MainLayout;
