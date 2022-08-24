import { PostDetailsType } from "@/types/index";
import { Post } from "@prisma/client";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface PostThumbnailProps {
  sharedPost: PostDetailsType;
  onClick?: React.MouseEventHandler<HTMLElement>;
  isSmall?: boolean;
}

const PostThumbnail = ({
  sharedPost,
  isSmall,
  ...onClick
}: PostThumbnailProps) => {
  const firstImage = sharedPost.images[0]?.url;

  return (
    <div
      className="ring-2 ring-inset ring-blue-400/30 rounded-lg mb-5 overflow-hidden"
      {...onClick}
    >
      <div className="flex items-center p-2">
        <Image
          src={sharedPost.user.image || "/images/fallback.svg"}
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
        <div
          className={clsx([
            "w-full h-96 relative overflow-hidden",
            isSmall && "!h-",
          ])}
        >
          <Image src={firstImage} alt="" layout="fill" objectFit="cover" />
        </div>
      )}
    </div>
  );
};

export default PostThumbnail;
