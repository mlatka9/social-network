/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Link from 'next/link';
import { signOut } from 'next-auth/react';

import ThemeSwitch from '@/components/common/theme-switch';
import ProfileIcon from '@/components/common/icons/profile';
import BookmarkIcon from '@/components/common/icons/bookmark-empty';
import LogOutIcon from '@/components/common/icons/log-out';
import GraphIcon from '../common/icons/graph';
import HashIcon from '../common/icons/hash';
import ExclamationIcon from '../common/icons/exclamation';

interface DropdownMenuProps {
  userId: string;
  closeDropDown: () => void;
  notificationCount: number | undefined;
}

const DropdownMenu = ({
  userId,
  closeDropDown,
  notificationCount,
}: DropdownMenuProps) => (
  <>
    <div
      aria-label="Close modal"
      className="bg-neutral-800 opacity-80 fixed inset-0 top-14 z-10 md:hidden"
      onClick={(e) => {
        e.stopPropagation();
        closeDropDown();
      }}
    />
    <nav className="fixed inset-0 top-14 left-14 md:inset-[unset] md:right-5 md:top-[72px] md:min-w-[300px] md:absolute z-[100] bg-primary-0 dark:bg-primary-dark-100  p-3 md:rounded-xl shadow-2xl select-none">
      <ThemeSwitch />
      <hr className="my-4 dark:border-primary-700" />
      <ul>
        <li className="hover:bg-slate-100  dark:hover:bg-primary-dark-200 rounded-lg flex items-center">
          <Link href={`/user/${userId}`}>
            <a className="px-3 py-3 w-full rounded-lg flex items-center">
              <ProfileIcon />
              <span className="ml-2">Profile</span>
            </a>
          </Link>
        </li>
        <li className="lg:hidden hover:bg-slate-100 dark:hover:bg-primary-dark-200  rounded-lg flex items-center w-full   ">
          <Link href="/bookmarks">
            <a className="px-3 py-3 w-full rounded-lg flex items-center">
              <BookmarkIcon />
              <span className="ml-2">Bookmarks</span>
            </a>
          </Link>
        </li>
        <li className="lg:hidden hover:bg-slate-100 dark:hover:bg-primary-dark-200  rounded-lg flex items-center w-full   ">
          <Link href="/community">
            <a className="px-3 py-3 w-full rounded-lg flex items-center">
              <GraphIcon />
              <span className="ml-2">Communities</span>
            </a>
          </Link>
        </li>
        <li className="lg:hidden hover:bg-slate-100  dark:hover:bg-primary-dark-200  rounded-lg flex items-center w-full   ">
          <Link href="/explore">
            <a className="px-3 py-3 w-full rounded-lg flex items-center">
              <HashIcon />
              <span className="ml-2">Explore</span>
            </a>
          </Link>
        </li>
        <li className="hover:bg-slate-100  dark:hover:bg-primary-dark-200  rounded-lg flex items-center w-full   ">
          <Link href="/notifications">
            <a className="px-3 py-3 w-full rounded-lg flex items-center relative">
              <ExclamationIcon />
              <span className="ml-2">Notifications</span>
              {!!notificationCount && (
                <div className="w-[22px] h-[22px] flex items-center justify-center text-sm text-white bg-red-500 absolute rounded-full right-1 top-1/2 -translate-y-1/2">
                  {notificationCount}
                </div>
              )}
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
  </>
);

export default DropdownMenu;
