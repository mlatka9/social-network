import { useSession } from "next-auth/react";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";
import UserSearch from "./user-search";
import Link from "next/link";
import UserProfilePicture from "./user-profile-image";
import { useState, useCallback, useEffect } from "react";
import DropdownMenu from "./dropdown-menu";
import { useRouter } from "next/router";

const Header = () => {
  const { data, status } = useSession();
  const [isDropdownShow, setIsDropdownShown] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownShown(!isDropdownShow);
  };

  const hideDropdown = useCallback(() => {
    setIsDropdownShown(false);
  }, []);

  useEffect(() => {
    console.log(router.asPath);
    hideDropdown();
  }, [router.asPath]);

  const user = data?.user;

  if (!user) return <div>Loading</div>;

  return (
    <div className="flex items-center justify-between bg-white py-3 px-5 sticky top-0 z-[50] shadow-md">
      <Link href="/" passHref>
        <a>
          <p className="text-blue-900 font-poppins font-semibold text-2xl mr-10">
            Twitterek
          </p>
        </a>
      </Link>

      <UserSearch />
      <button
        className="w-10 h-10 rounded-full relative overflow-hidden"
        onClick={toggleDropdown}
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
  );
};

export default Header;
