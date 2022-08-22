import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

interface DropdownMenu {
  userId: string;
}

const DropdownMenu = ({ userId }: DropdownMenu) => {
  return (
    <>
      <nav className="z-[100] bg-white absolute top-[calc(100%_+_10px)] right-5 p-3 rounded-xl min-w-[200px] shadow-2xl select-none">
        <ul>
          <li className="hover:bg-slate-100 rounded-lg flex items-center">
            <Link href={`/user/${userId}`}>
              <a className="px-3 py-2 w-full rounded-lg">
                <Image
                  src="/icons/profile.png"
                  width="20"
                  height="20"
                  alt=""
                  layout="fixed"
                />
                <span className="ml-2">Profile</span>
              </a>
            </Link>
          </li>

          <li className="hover:bg-slate-100  rounded-lg flex items-center w-full   ">
            <Link href="/bookmarks">
              <a className="px-3 py-2 w-full rounded-lg">
                <Image
                  src="/icons/bookmark.png"
                  width="20"
                  height="20"
                  alt=""
                />
                <span className="ml-2">Bookmarks</span>
              </a>
            </Link>
          </li>
          <li className="hover:bg-slate-100 rounded-lg ">
            <button
              onClick={() => signOut()}
              className="flex items-center px-3 py-2 w-full rounded-lg"
            >
              <Image src="/icons/log-out.png" width="20" height="20" alt="" />
              <span className="ml-2">Log Out</span>
            </button>
          </li>
        </ul>
      </nav>
      {/* <div className="fixed inset-0 z-[50]" onClick={hideDropdown} /> */}
    </>
  );
};

export default DropdownMenu;
