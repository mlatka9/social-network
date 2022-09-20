/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useMarkNotificationAsRead } from '@/hooks/mutation';
import { NotificationMentionsType } from '@/types/db';
import Image from 'next/image';
import Link from 'next/link';
import ReactTimeAgo from 'react-time-ago';

interface NotificationCardProps {
  notification: NotificationMentionsType;
}
const NotificationMentionCard = ({ notification }: NotificationCardProps) => {
  const markAsReaded = useMarkNotificationAsRead();

  const onClick = () => {
    markAsReaded({ notificationId: notification.id });
  };

  return (
    <Link href={`post/${notification.postId}`}>
      <a className="block" onClick={onClick}>
        <div className=" bg-primary-0 dark:bg-primary-dark-200 px-5 py-3 flex items-center text-primary-600 rounded-lg">
          <Image
            src={notification.postAutor.image || '/images/fallback.svg'}
            width={40}
            height={40}
            alt=""
            objectFit="cover"
            className="rounded-lg"
          />
          <div className="ml-3 flex flex-col">
            <p className="dark:text-primary-dark-600">
              <span className="font-medium text-primary-800 dark:text-primary-dark-800 mr-1">
                {notification.postAutor.name}
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
};

export default NotificationMentionCard;
