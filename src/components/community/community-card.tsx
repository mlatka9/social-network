import Link from "next/link";
import UserProfilePicture from "../common/user-profile-image";
import type { CommunityDetailsType } from "@/types/db";
import Image from "next/image";
import JoinCommunityButton from "./join-community-button";

type CommunityCardProps = {
  image: string;
  memebrsCount: number;
  name: string;
  description: string;
  categoryName: string;
  isOwner: boolean;
  joinedByMe: boolean;
};

const CommunityCard = ({
  image,
  memebrsCount,
  name,
  description,
  categoryName,
  isOwner,
  joinedByMe,
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
          <p className="text-sm font-bold">{categoryName}</p>
        </div>
      </div>
      {description && (
        <p className="text-sm text-neutral-600 mt-3">{description}</p>
      )}
    </div>
  );
};

export default CommunityCard;
