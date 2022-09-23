/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { NotificationStartFollowType } from '@/types/db';
import Link from 'next/link';
import ReactTimeAgo from 'react-time-ago';
import NotificationCardWrapper from './notification-card-wrapper';

interface NotificationStartFolowCardProps {
  notification: NotificationStartFollowType;
}

const NotificationsStartFollowCard = ({
  notification,
}: NotificationStartFolowCardProps) => (
  <Link href={`user/${notification.userId}`}>
    <a className="block">
      <NotificationCardWrapper
        imageUrl={notification.user.image}
        isRead={notification.isRead}
        notificationId={notification.id}
      >
        <p className="dark:text-primary-dark-600">
          <span className="font-medium  text-primary-800 dark:text-primary-dark-800 mr-1">
            {notification.user.name}
          </span>
          started following you
        </p>
        <ReactTimeAgo
          date={notification.createdAt}
          className="font-medium text-xs text-gray-400 dark:text-primary-dark-600"
        />
      </NotificationCardWrapper>
    </a>
  </Link>
);

export default NotificationsStartFollowCard;
