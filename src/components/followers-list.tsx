import { useState } from "react";
import { trpc } from "src/utils/trpc";
import ButtonFollow from "./button-follow";
import UserProfilePicture from "./user-profile-image";
import clsx from "clsx";
import ModalWrapper from "@/components/modal-wrapper";

interface FollowersListProps {
  userId: string;
  closeFollowersModal: () => void;
  selectedFollowType: FollowsListType;
}

export type FollowsListType = "followers" | "following";

const FollowersList = ({
  userId,
  closeFollowersModal,
  selectedFollowType,
}: FollowersListProps) => {
  const [selectedFollowListType, setSelectedFollowListType] =
    useState<FollowsListType>(selectedFollowType);
  const follows = trpc.useQuery(["user.getFollows", { userId: userId }]);

  const me = trpc.useQuery(["user.me"]);

  const selectedListDat =
    selectedFollowListType === "followers"
      ? follows.data?.followedBy || []
      : follows.data?.following || [];

  return (
    <ModalWrapper
      title={me.data?.name || ""}
      handleCloseModal={closeFollowersModal}
    >
      <div className="flex font-poppins font-semibold pt-10 pb-10 justify-center space-x-10">
        <div>
          <button onClick={() => setSelectedFollowListType("following")}>
            Following
          </button>
          <div
            className={clsx([
              "bg-blue-500 w-full h-1 opacity-0 transition-opacity",
              selectedFollowListType === "following" && "opacity-100",
            ])}
          />
        </div>
        <div>
          <button onClick={() => setSelectedFollowListType("followers")}>
            Followers
          </button>
          <div
            className={clsx([
              "bg-blue-500 w-full h-1 opacity-0 transition-opacity",
              selectedFollowListType === "followers" && "opacity-100",
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
    </ModalWrapper>
  );
};

export default FollowersList;
