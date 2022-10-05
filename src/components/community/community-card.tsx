import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
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
  hasShortDescription?: boolean;
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
  hasShortDescription,
}: CommunityCardProps) => {
  const formattedDescription =
    hasShortDescription && description.length > 100
      ? description.slice(0, 100).trim().concat('...')
      : description;

  return (
    <div className="rounded-lg space-y-3">
      <div className="flex">
        <Link href={`/community/${id}`}>
          <div className="shrink-0 cursor-pointer">
            <Image
              src={image || '/images/community-fallback.svg'}
              width="40"
              height="40"
              layout="fixed"
              alt=""
              className="rounded-lg block"
              objectFit="cover"
              unoptimized
            />
          </div>
        </Link>

        <div className="grid grid-cols-[auto_1fr] w-full">
          <div className="mx-3 dark:text-primary-dark-800 overflow-hidden">
            <Link href={`/community/${id}`}>
              <a className="font-poppins font-medium hover:underline block">
                {name}
              </a>
            </Link>
            <p className=" text-neutral-500 dark:text-primary-dark-600 text-xs font-medium">
              {membersCount} Members
            </p>
          </div>

          <div className="ml-auto flex sm:space-x-1 flex-col-reverse items-baseline justify-end sm:flex-row">
            {isOwner && (
              <div className="ml-auto text-sm  bg-yellow-200 dark:bg-yellow-300 text-yellow-800 px-1 py-[2px] rounded-md mb-1">
                onwer
              </div>
            )}
            {joinedByMe && (
              <div className="ml-auto text-sm  bg-orange-200 dark:bg-orange-300 text-orange-900 px-1 py-[2px] rounded-md mb-1">
                joined
              </div>
            )}
            <p className="text-sm font-medium font-poppins text-right dark:text-primary-dark-800">
              {categoryName}
            </p>
          </div>
        </div>
      </div>

      {description && (
        <p className="text-sm text-neutral-600 dark:text-primary-dark-600 overflow-hidden">
          {formattedDescription}
        </p>
      )}

      <div className="flex items-center ">
        <CommunityFavouriteIcon
          isMyfavourite={isMyfavourite}
          communityId={id}
        />
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
};

export default CommunityCard;
