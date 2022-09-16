/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import Link from 'next/link';
import ShareIcon from '../common/icons/share';

interface RepostBadgeProps {
  users: { name: string | null; id: string }[];
}

const RepostBadge = ({ users }: RepostBadgeProps) => (
  <div className="flex">
    <ShareIcon
      width={16}
      height={16}
      className="fill-primary-400 dark:fill-primary-dark-600"
    />
    <div className="ml-2 font-medium text-sm text-primary-400 dark:text-primary-dark-600 flex">
      {users.slice(0, 1).map((user) => (
        <Link href={`/user/${user.id}`} key={user.id}>
          <a
            onClick={(e) => e.stopPropagation()}
            className="flex items-center hover:underline w-fit"
          >
            <p>{user.name}</p>
          </a>
        </Link>
      ))}
      <p className="ml-1">reshared</p>
    </div>
  </div>
);

export default RepostBadge;
