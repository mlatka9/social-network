import Link from 'next/link';
import { signOut } from 'next-auth/react';

import ThemeSwitch from '@/components/common/theme-switch';
import ProfileIcon from '@/components/common/icons/profile';
import BookmarkIcon from '@/components/common/icons/bookmark-empty';
import LogOutIcon from '@/components/common/icons/log-out';
import GraphIcon from '../common/icons/graph';
import HashIcon from '../common/icons/hash';

interface DropdownMenuProps {
  userId: string;
}

const DropdownMenu = ({ userId }: DropdownMenuProps) => (
  <nav className="fixed inset-0 top-14 left-14 md:inset-[unset] md:right-5 md:top-[72px] md:min-w-[300px] md:absolute z-[100] bg-primary-0 dark:bg-primary-dark-100  p-3 md:rounded-xl shadow-2xl select-none">
    <ThemeSwitch />
    <hr className="my-4 dark:border-primary-700" />
    <ul className="">
      <li className="hover:bg-slate-100  dark:hover:bg-primary-dark-200 rounded-lg flex items-center">
        <Link href={`/user/${userId}`}>
          <a className="px-3 py-3 w-full rounded-lg flex">
            <ProfileIcon />
            <span className="ml-2">Profile</span>
          </a>
        </Link>
      </li>
      <li className="hover:bg-slate-100 dark:hover:bg-primary-dark-200  rounded-lg flex items-center w-full   ">
        <Link href="/bookmarks">
          <a className="px-3 py-3 w-full rounded-lg flex">
            <BookmarkIcon />
            <span className="ml-2">Bookmarks</span>
          </a>
        </Link>
      </li>
      <li className="hover:bg-slate-100 dark:hover:bg-primary-dark-200  rounded-lg flex items-center w-full   ">
        <Link href="/community">
          <a className="px-3 py-3 w-full rounded-lg flex">
            <GraphIcon />
            <span className="ml-2">Communities</span>
          </a>
        </Link>
      </li>
      <li className="hover:bg-slate-100  dark:hover:bg-primary-dark-200  rounded-lg flex items-center w-full   ">
        <Link href="/explore">
          <a className="px-3 py-3 w-full rounded-lg flex">
            <HashIcon />
            <span className="ml-2">Explore</span>
          </a>
        </Link>
      </li>
      <li className="hover:bg-slate-100 dark:hover:bg-primary-dark-200 rounded-lg ">
        <button
          type="button"
          onClick={() => signOut()}
          className="flex items-center px-3 py-3 w-full rounded-lg"
        >
          <LogOutIcon />
          <span className="ml-2">Log Out</span>
        </button>
      </li>
    </ul>
  </nav>
);

export default DropdownMenu;
