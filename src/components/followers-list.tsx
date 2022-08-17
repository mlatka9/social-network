import { useState } from "react";
import { trpc } from "src/utils/trpc";
import ButtonFollow from "./button-follow";
import UserProfilePicture from "./user-profile-image";
import clsx from "clsx";
import { useRouter } from "next/router";
import Link from "next/link";

interface FollowersListProps {
  userId: string;
}

export type FollowsListType = "followers" | "following";

const FollowersList = ({ userId }: FollowersListProps) => {
  const { query } = useRouter();

  const followType = query.params?.[1] as FollowsListType;

  const follows = trpc.useQuery(["user.getFollows", { userId: userId }]);

  const selectedListDat =
    followType === "followers"
      ? follows.data?.followedBy || []
      : follows.data?.following || [];

  return (
    <>
      <div className="flex font-poppins font-semibold pt-10 pb-10 justify-center space-x-10">
        <div>
          <Link href={`/user/${userId}/following`}>
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
          <Link href={`/user/${userId}/followers`}>
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
        {selectedListDat?.length > 0 ? (
          selectedListDat?.map((user) => (
            <div key={user.id}>
              <div className="flex mb-3">
                <UserProfilePicture
                  imageUrl={user.image || ""}
                  userID={user.id}
                />
                <div className="ml-3">
                  <p className=" font-poppins font-medium">{user.name}</p>
                  <p className=" text-neutral-500 text-xs font-medium">
                    {user.followers} followers
                  </p>
                </div>

                <ButtonFollow userId={user.id} />
              </div>
              <p className="text-sm text-neutral-600">
                {user.bio || "no bio no bio no bio no bio"}
              </p>
            </div>
          ))
        ) : (
          <div>empty</div>
        )}
      </div>
    </>
  );
};

export default FollowersList;
