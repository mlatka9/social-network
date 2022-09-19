import { NotificationType } from '@/types/db';
import Image from 'next/image';
import Link from 'next/link';
import ReactTimeAgo from 'react-time-ago';

interface NotificationCardProps {
  notification: NotificationType;
}
const NotificationCard = ({ notification }: NotificationCardProps) => (
  <Link href={`post/${notification.postId}`}>
    <a className="block">
      <div className=" bg-primary-0 px-5 py-3 flex items-center text-primary-600 rounded-lg">
        <Image
          src={notification.post.user.image || '/images/fallback.svg'}
          width={40}
          height={40}
          alt=""
          objectFit="cover"
          className="rounded-lg"
        />
        <div className="ml-3 flex flex-col">
          <p>
            <span className="font-medium text-primary-800">
              {notification.post.user.name}
            </span>
            has mentioned you in post
          </p>
          <ReactTimeAgo
            date={notification.createdAt}
            className="font-medium text-xs text-gray-400 dark:text-primary-dark-600"
          />
        </div>
      </div>
    </a>
  </Link>
);

export default NotificationCard;
