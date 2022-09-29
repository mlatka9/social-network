import { ReactNode } from 'react';
import TrendingTagsList from '@/components/common/trending-tags-list';
import { ToastContainer } from 'react-toastify';

import Header from '../header/header';
import BackButton from '../common/back-button';
import SuggestionList from '../community/suggestion-list';

interface LayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => (
  <div>
    <Header />
    <div className="no-scroll-shake">
      <div className="relative min-h-screen grid grid-cols-1 max-w-[1000px] lg:grid-cols-[1fr_300px] mx-auto gap-x-5 mt-0 lg:mt-5 ">
        <main className=" w-full max-w-[680px] mx-auto">
          <BackButton />
          {children}
        </main>

        <div className="h-fit max-h-[calc(100vh-92px)] space-y-5 lg:block hidden sticky top-[92px] overflow-auto rounded-xl">
          <TrendingTagsList />
          <SuggestionList />
        </div>
      </div>
    </div>
    <ToastContainer autoClose={3000} position="bottom-right" />
  </div>
);

export default MainLayout;
