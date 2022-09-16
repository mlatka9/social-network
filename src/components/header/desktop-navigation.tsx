import Link from 'next/link';
import BookmarkEmptyIcon from '../common/icons/bookmark-empty';
import GraphIcon from '../common/icons/graph';
import HashIcon from '../common/icons/hash';

const DesktopNavigation = () => (
  <nav className="hidden lg:block ml-auto mr-10">
    <ul className="flex">
      <li className="hover:bg-slate-100 dark:hover:bg-primary-dark-200  rounded-lg flex items-center w-full   ">
        <Link href="/bookmarks">
          <a className="px-3 py-3 w-full rounded-lg flex">
            <BookmarkEmptyIcon />
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
    </ul>
  </nav>
);

export default DesktopNavigation;
