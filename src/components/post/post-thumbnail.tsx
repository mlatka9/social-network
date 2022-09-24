import clsx from 'clsx';
import Image from 'next/image';
import router from 'next/router';
import React from 'react';
import { SharedPostType } from '@/types/db';

interface PostThumbnailProps {
  sharedPost: SharedPostType;
  disableLink?: boolean;
}

const PostThumbnail = ({ sharedPost, disableLink }: PostThumbnailProps) => {
  const goToSharedPost = () => {
    if (disableLink) return;
    router.push(`/post/${sharedPost.id}`);
  };

  if (sharedPost.isDeleted) {
    return (
      <div className="bg-neutral-100 dark:bg-primary-dark-200 p-1 text-sm text-neutral-700 ring-2 ring-inset ring-blue-400/30 rounded-lg mb-5">
        post removed
      </div>
    );
  }

  const firstImage = sharedPost.images[0];

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.code === 'Enter') {
          goToSharedPost();
        }
      }}
      className="ring-2 ring-blue-400/30 rounded-md dark:bg-primary-dark-200 bg-primary-0"
      onClick={(e) => {
        e.stopPropagation();
        goToSharedPost();
      }}
    >
      <div className="flex items-center p-2">
        <Image
          src={sharedPost.user.image || '/images/avatar-fallback.svg'}
          alt=""
          width="20"
          height="20"
          className="rounded-full"
        />

        <div className="flex items-baseline">
          <p className="ml-2 ">{sharedPost.user.name}</p>
          <p className="ml-2 font-medium text-xs text-gray-400">
            {sharedPost.createdAt.toDateString()}
          </p>
        </div>
      </div>
      <p className="mx-2 mb-2">{sharedPost.content}</p>

      {firstImage && (
        <div className={clsx('w-full h-96 relative rounded-md')}>
          <Image
            src={firstImage.fallbackUrl}
            alt=""
            layout="fill"
            objectFit="cover"
            className="absolute blur-sm rounded-md"
          />
          <Image
            src={firstImage.url}
            alt=""
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default PostThumbnail;
