import { ReactNode } from 'react';
import Header from '@/components/header/header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

interface LayoutProps {
  children: ReactNode;
}

const CommunityLayout = ({ children }: LayoutProps) => (
  <div>
    <Header />
    <div className="no-scroll-shake">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[300px_1fr] max-w-[680px] lg:max-w-[1000px] mx-auto gap-x-5 mt-5">
        {children}
      </div>
    </div>
    <ToastContainer autoClose={3000} position="bottom-right" />
  </div>
);

export default CommunityLayout;
