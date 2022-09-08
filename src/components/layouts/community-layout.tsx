import { ReactNode } from 'react';
import Header from '@/components/header/header';
import TrendingTagsList from '@/components/common/trending-tags-list';
import { ToastContainer } from 'react-toastify';
import SuggestionList from '../community/suggestion-list';

interface LayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => (
  <>
    <Header />
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[220px_1fr_300px] max-w-[1100px] mx-auto gap-x-5 mt-5">
      {children}
      <aside className="hidden xl:block sticky h-fit top-[92px] space-y-5">
        <TrendingTagsList />
        {/* <PopularCommunitiesList /> */}
        <SuggestionList />
      </aside>
    </div>
    <ToastContainer autoClose={3000} position="bottom-right" />
  </>
);

export default MainLayout;
