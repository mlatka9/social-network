import Link from 'next/link';
import React from 'react';

import SearchBar from '@/components/common/search-bar';
import Menu from '@/components/header/menu';

const Header = () => (
  <div className="dark:bg-primary-dark-100 flex items-center justify-between bg-primary-50 py-3 px-5 sticky top-0 z-[10] shadow-md">
    <Link href="/" passHref>
      <a>
        <p className="text-blue-900 dark:text-white font-poppins font-semibold text-2xl mr-10">
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
