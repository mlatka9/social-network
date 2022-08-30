import UserProfilePicture from "@/components/common/user-profile-image";
import clsx from "clsx";
import Link from "next/link";
import ReactTimeAgo from "react-time-ago";

interface AuthorProps {
  authorId: string;
  authorImage: string | null;
  authorName: string | null;
  postCreatedAt: Date;
  isWide?: boolean;
}

const Author = ({
  authorId,
  authorImage,
  authorName,
  postCreatedAt,
}: AuthorProps) => {
  return (
    <div className="flex">
      <UserProfilePicture imageUrl={authorImage} userID={authorId} />
      <div className={clsx(["ml-4"])}>
        <Link href={`/user/${authorId}`}>
          <a
            className="h-10 font-medium mr-2 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {authorName}
          </a>
        </Link>
        <p className="font-medium text-xs text-gray-400">
          <ReactTimeAgo date={postCreatedAt} />
        </p>
      </div>
    </div>
  );
};

export default Author;
