import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";

interface DropdownMenu {
  hideDropdown: () => void;
  userId: string;
}

const DropdownMenu = ({ hideDropdown, userId }: DropdownMenu) => {
  const router = useRouter();

  return (
    <>
      <nav className="z-[100] bg-white absolute top-[calc(100%_+_10px)] right-5 p-3 rounded-xl min-w-[200px] shadow-2xl select-none">
        <ul>
          <Link href={`/user/${userId}`}>
            <a>
              <li className="hover:bg-slate-100 px-3 py-2 rounded-lg flex items-center">
                <Image
                  src="/icons/profile.png"
                  width="20"
                  height="20"
                  alt=""
                  layout="fixed"
                />
                <span className="ml-2">Profile</span>
              </li>
            </a>
          </Link>
          <Link href="/bookmarks">
            <a>
              <li className="hover:bg-slate-100 px-3 py-2 rounded-lg flex items-center">
                <Image
                  src="/icons/bookmark.png"
                  width="20"
                  height="20"
                  alt=""
                />
                <span className="ml-2">Bookmarks</span>
              </li>
            </a>
          </Link>
          <li className="hover:bg-slate-100  rounded-lg ">
            <button
              onClick={() => signOut()}
              className="flex items-center px-3 py-2 w-full"
            >
              <Image src="/icons/log-out.png" width="20" height="20" alt="" />
              <span className="ml-2">Log Out</span>
            </button>
          </li>
        </ul>
      </nav>
      <div className="fixed inset-0 z-[50]" onClick={hideDropdown} />
    </>
  );
};

export default DropdownMenu;
