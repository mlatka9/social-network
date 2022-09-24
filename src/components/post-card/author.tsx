/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import clsx from 'clsx';
import Link from 'next/link';
import ReactTimeAgo from 'react-time-ago';
import UserProfilePicture from '@/components/common/user-profile-image';

interface AuthorProps {
  authorId: string;
  authorImage: string | null;
  authorName: string | null;
  postCreatedAt: Date;
}

const Author = ({
  authorId,
  authorImage,
  authorName,
  postCreatedAt,
}: AuthorProps) => (
  <div className="flex">
    <UserProfilePicture imageUrl={authorImage} userID={authorId} />
    <div className={clsx(['ml-4'])}>
      <Link href={`/user/${authorId}`}>
        <a
          className="h-10 font-medium mr-2 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {authorName}
        </a>
      </Link>
      <p className="font-medium text-xs text-gray-400 dark:text-primary-dark-600">
        <ReactTimeAgo date={postCreatedAt} />
      </p>
    </div>
  </div>
);

export default Author;
