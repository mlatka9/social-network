import ButtonFollow from "./button-follow";
import UserProfilePicture from "./user-profile-image";
import clsx from "clsx";
import { useRouter } from "next/router";
import Link from "next/link";
import { useFollowsQuery } from "src/hooks/query";
import UserCard from "./user-card";

export type FollowsListType = "followers" | "following";

const FollowersList = () => {
  const { query } = useRouter();

  const userId = query.params?.[0]!;
  const followType = query.params?.[1] as FollowsListType;

  const { data } = useFollowsQuery(userId);

  const selectedListDat =
    (followType === "followers" ? data?.followedBy : data?.following) || [];

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
              followType === "following" && "opacity-100",
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
              followType === "followers" && "opacity-100",
            ])}
          />
        </div>
      </div>
      <div>
        {selectedListDat?.map((user) => (
          <UserCard
            key={user.id}
            bio={user.bio}
            followers={user.followers}
            id={user.id}
            image={user.image}
            name={user.name}
          />
        ))}
      </div>
    </>
  );
};

export default FollowersList;
