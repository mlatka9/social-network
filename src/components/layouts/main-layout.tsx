import { ReactNode } from 'react';
import PopularCommunitiesList from '@/components/community/popular-communities-list';
import Header from '../header/header';
import TrendingTagsList from '@/components/common/trending-tags-list';

interface LayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => (
  <div>
    <Header />
    <div className="min-h-screen grid grid-cols-1 max-w-[1000px] lg:grid-cols-[1fr_300px] mx-auto gap-x-5 mt-0 lg:mt-5 ">
      <main className=" w-full max-w-[680px] mx-auto">{children}</main>
      <div className="sticky h-fit top-[92px] space-y-5 lg:block hidden">
        <TrendingTagsList />
        <PopularCommunitiesList />
      </div>
    </div>
  </div>
);

export default MainLayout;
