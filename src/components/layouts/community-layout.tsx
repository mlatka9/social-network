import { ReactNode } from 'react';
import PopularCommunitiesList from '@/components/community/popular-communities-list';
import Header from '../header/header';
import TrendingTagsList from '@/components/common/trending-tags-list';

interface LayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => (
  <>
    <Header />
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[300px_1fr_300px] max-w-[1100px] mx-auto gap-x-5 mt-5">
      {children}
      <aside className="hidden xl:block sticky h-fit top-[92px] space-y-5">
        <TrendingTagsList />
        <PopularCommunitiesList />
      </aside>
    </div>
  </>
);

export default MainLayout;
