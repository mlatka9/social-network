import UserSearch from "../common/user-search";
import Link from "next/link";
import React from "react";
import Menu from "@/components/header/menu";

const Header = () => {
  return (
    <div className="flex items-center justify-between bg-white py-3 px-5 sticky top-0 z-[10] shadow-md">
      <Link href="/" passHref>
        <a>
          <p className="text-blue-900 font-poppins font-semibold text-2xl mr-10">
            Twitterek
          </p>
        </a>
      </Link>
      <UserSearch />
      <Menu />
    </div>
  );
};

export default Header;
