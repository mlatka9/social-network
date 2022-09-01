import ButtonFollow from "./button-follow";
import UserProfilePicture from "./user-profile-image";
import clsx from "clsx";
import { useRouter } from "next/router";
import Link from "next/link";
// import { useFollowsQuery } from "src/hooks/query";
import UserCard from "./user-card";
import FollowersList from "./followers-list";
import FollowingList from "./following-list";

// export type FollowsListType = "followers" | "following";

interface FollowersListProps {
  section: "followers" | "following";
  userId: string;
}

const UserFollows = ({ section, userId }: FollowersListProps) => {
  return (
    <>
      <div className="flex font-poppins font-semibold pb-10 justify-center space-x-10">
        <div>
          <Link href={`/user/${userId}/following`} shallow={true}>
            <a>
              <div>Following</div>
            </a>
          </Link>

          <div
            className={clsx([
              "bg-blue-500 w-full h-1 opacity-0 transition-opacity",
              section === "following" && "opacity-100",
            ])}
          />
        </div>
        <div>
          <Link href={`/user/${userId}/followers`} shallow={true}>
            <a>
              <div>Followers</div>
            </a>
          </Link>
          <div
            className={clsx([
              "bg-blue-500 w-full h-1 opacity-0 transition-opacity",
              section === "followers" && "opacity-100",
            ])}
          />
        </div>
      </div>
      {section === "followers" && <FollowersList userId={userId} />}
      {section === "following" && <FollowingList userId={userId} />}
    </>
  );
};

export default UserFollows;
