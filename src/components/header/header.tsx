import Link from 'next/link';
import React from 'react';
import SearchBar from '@/components/header/search-bar';
import Menu from '@/components/header/menu';
import DesktopNavigation from './desktop-navigation';

const Header = () => (
  <div className="dark:bg-primary-dark-50 flex items-center justify-between bg-primary-50 px-3 py-2 md:py-3 md:px-5 sticky top-0 z-[10] shadow-md no-scroll-header">
    <Link href="/" passHref>
      <a>
        <p className="text-blue-900 dark:text-white font-poppins font-semibold text-lg md:text-2xl w-min md:w-fit">
          Social Network
        </p>
      </a>
    </Link>
    <SearchBar />
    <DesktopNavigation />
    <Menu />
  </div>
);

export default Header;
