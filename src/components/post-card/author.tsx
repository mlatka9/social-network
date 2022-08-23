import UserProfilePicture from "@/components/common/user-profile-image";
import clsx from "clsx";

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
        <p className="font-medium mr-2">{authorName}</p>
        <p className="font-medium text-xs text-gray-400">
          {postCreatedAt.toDateString()}
        </p>
      </div>
    </div>
  );
};

export default Author;
