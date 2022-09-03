import Link from 'next/link';
import React from 'react';

import SearchBar from '@/components/common/search-bar';
import Menu from '@/components/header/menu';

const Header = () => (
  <div className="dark:bg-primary-dark-100 flex items-center justify-between bg-primary-50 px-3 py-2 md:py-3 md:px-5 sticky top-0 z-[10] shadow-md">
    <Link href="/" passHref>
      <a>
        <p className="text-blue-900 dark:text-white font-poppins font-semibold text-lg md:text-2xl">
          Twitterek
        </p>
      </a>
    </Link>

    <SearchBar />
    <div className="flex space-x-3">
      <Menu />
    </div>
  </div>
);

export default Header;
