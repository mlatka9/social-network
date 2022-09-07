import Image from 'next/image';
import React from 'react';
import JoinCommunityButton from './join-community-button';
import CommunityFavouriteIcon from './community-favourite-icon';

type CommunityCardProps = {
  id: string;
  image: string;
  membersCount: number;
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
  membersCount,
  name,
  description,
  categoryName,
  isOwner,
  joinedByMe,
  isMyfavourite,
}: CommunityCardProps) => (
  <div className="bg-white py-3 px-5 rounded-lg space-y-3">
    <div className="flex">
      <Image
        src={image || '/images/fallback.svg'}
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
          {membersCount} Members
        </p>
      </div>
      <div className="flex ml-auto space-x-1 flex-col-reverse items-end justify-end sm:flex-row sm:items-baseline">
        {isOwner && (
          <div className="text-sm  bg-yellow-200 text-yellow-800 px-1 py-[2px] rounded-md mb-1">
            onwer
          </div>
        )}
        {joinedByMe && (
          <div className="text-sm  bg-orange-200 text-orange-900 px-1 py-[2px] rounded-md mb-1">
            joined
          </div>
        )}
        <p className="text-sm font-medium font-poppins mb-1 text-right">
          {categoryName}
        </p>
      </div>
    </div>
    {description && <p className="text-sm text-neutral-600">{description}</p>}

    <div className="flex items-center ">
      <CommunityFavouriteIcon isMyfavourite={isMyfavourite} communityId={id} />
      {!isOwner && (
        <JoinCommunityButton
          communityName={name}
          joinedByMe={joinedByMe}
          communityId={id}
          isSmall
          className="ml-auto"
        />
      )}
    </div>
  </div>
);

export default CommunityCard;
