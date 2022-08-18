import { useSession } from "next-auth/react";
import Image from "next/image";
import UserSearch from "./user-search";
import Link from "next/link";
import { useState, useCallback, useRef, useEffect } from "react";
import DropdownMenu from "./dropdown-menu";
import { useRouter } from "next/router";
import React from "react";
import { useOnClickOutside } from "usehooks-ts";

const Header = () => {
  const router = useRouter();
  const { data } = useSession();

  const [isDropdownShow, setIsDropdownShown] = useState(false);

  const ref = useRef(null);

  const hideDropdown = useCallback(() => {
    setIsDropdownShown(false);
  }, []);

  useEffect(() => {
    hideDropdown();
  }, [router.asPath, hideDropdown]);

  const openDropDown = () => {
    if (isDropdownShow) return;
    setIsDropdownShown(true);
  };

  const toggleDropdownShow = () => {
    setIsDropdownShown(!isDropdownShow);
  };

  useOnClickOutside(ref, () => hideDropdown());

  const user = data?.user;

  if (!user) return <div>Loading</div>;

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
      <div ref={ref} onClick={toggleDropdownShow}>
        <button
          className="w-10 h-10 rounded-full relative overflow-hidden"
          onClick={openDropDown}
        >
          <Image
            layout="fill"
            src={user?.image || "/images/fallback.svg"}
            alt=""
          />
        </button>

        {isDropdownShow && (
          <DropdownMenu hideDropdown={hideDropdown} userId={user.id} />
        )}
      </div>
    </div>
  );
};

export default Header;
