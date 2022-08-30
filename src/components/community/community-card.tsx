import Link from "next/link";
import UserProfilePicture from "../common/user-profile-image";
import type { CommunityDetailsType } from "@/types/db";
import Image from "next/image";
import JoinCommunityButton from "./join-community-button";

type CommunityCardProps = Omit<CommunityDetailsType, "isAdmin" | "bannerImage">;

const CommunityCard = ({
  image,
  id,
  memebrsCount,
  name,
  joinedByMe,
  description,
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

        <JoinCommunityButton joinedByMe={joinedByMe} communityId={id} />
      </div>
      {description && (
        <p className="text-sm text-neutral-600 mt-3">{description}</p>
      )}
    </div>
  );
};

export default CommunityCard;
