import Link from "next/link";
import UserProfilePicture from "../common/user-profile-image";
import type { CommunityDetailsType } from "@/types/db";
import Image from "next/image";
import JoinCommunityButton from "./join-community-button";
import StarEmptyIcon from "../common/icons/star-empty";
import StarIcon from "../common/icons/star";
import { useToggleMarkFavouriteCommunityMutation } from "src/hooks/mutation";
import React from "react";
import CommunityFavouriteIcon from "./community-favourite-icon";

type CommunityCardProps = {
  id: string;
  image: string;
  memebrsCount: number;
  name: string;
  description: string;
  categoryName: string;
  isOwner: boolean;
  joinedByMe: boolean;
  isMyfavourite: boolean;
};

const CommunityCard = ({
  id,
  image,
  memebrsCount,
  name,
  description,
  categoryName,
  isOwner,
  joinedByMe,
  isMyfavourite,
}: CommunityCardProps) => {
  return (
    <div className="mb-5 bg-white py-3 px-5 rounded-lg">
      <div className="flex">
        <Image
          src={image || "/images/fallback.svg"}
          width="40"
          height="40"
          layout="fixed"
          alt=""
          className="rounded-lg"
          objectFit="cover"
        />
        <div className="ml-3">
          <p className=" font-poppins font-medium">{name}</p>
          <p className=" text-neutral-500 text-xs font-medium">
            {memebrsCount} Members
          </p>
        </div>
        <div className="flex items-baseline ml-auto space-x-1">
          {isOwner && (
            <div className="text-sm  bg-yellow-200 text-yellow-800 px-1 py-[2px] rounded-md">
              onwer
            </div>
          )}
          {joinedByMe && (
            <div className="text-sm  bg-orange-200 text-orange-900 px-1 py-[2px] rounded-md">
              joined
            </div>
          )}
          <p className="text-sm font-medium font-poppins">{categoryName}</p>
        </div>
      </div>
      {description && (
        <p className="text-sm text-neutral-600 my-3">{description}</p>
      )}

      <div className="flex items-center ">
        <CommunityFavouriteIcon
          isMyfavourite={isMyfavourite}
          communityId={id}
        />
        {!isOwner && (
          <JoinCommunityButton
            joinedByMe={joinedByMe}
            communityId={id}
            className="text-xs !px-4 py-1"
          />
        )}
      </div>
    </div>
  );
};

export default CommunityCard;
