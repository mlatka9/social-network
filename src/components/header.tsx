import { useSession } from "next-auth/react";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";
import UserSearch from "./user-search";
import Link from "next/link";
import UserProfilePicture from "./user-profile-image";

const Header = () => {
  const { data, status } = useSession();

  //   if (status !== "authenticated") return <></>;

  return (
    <div className="flex items-center bg-white py-3 px-5">
      <Link href="/" passHref>
        <a>
          <p className="text-blue-900 font-poppins font-semibold text-2xl mr-10">
            Twitterek
          </p>
        </a>
      </Link>
      <Link href="/bookmarks" passHref>
        <a>
          <p className="text-blue-500 font-poppins font-semibold text-lg mr-10 underline underline-offset-4">
            bookmarks
          </p>
        </a>
      </Link>
      {status === "authenticated" ? (
        <button onClick={() => signOut()}>sign out</button>
      ) : (
        <button onClick={() => signIn()}>sign in</button>
      )}
      <p className="ml-auto">{data?.user?.email}</p>
      <UserSearch />
      <UserProfilePicture
        imageUrl={data?.user?.image || "/images/fallback.svg"}
        userID={data?.user?.id || ""}
      />
    </div>
  );
};

export default Header;
