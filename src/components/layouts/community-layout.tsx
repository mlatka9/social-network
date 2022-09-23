import { ReactNode } from 'react';
import Header from '@/components/header/header';
import { ToastContainer } from 'react-toastify';

interface LayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => (
  <>
    <Header />
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[300px_1fr] max-w-[680px] lg:max-w-[1000px] mx-auto gap-x-5 mt-5">
      {children}
    </div>
    <ToastContainer autoClose={3000} position="bottom-right" />
  </>
);

export default MainLayout;
