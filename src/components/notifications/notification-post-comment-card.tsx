/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { NotificationPostComment } from '@/types/db';
import Link from 'next/link';
import ReactTimeAgo from 'react-time-ago';
import NotificationCardWrapper from './notification-card-wrapper';

interface NotificationPostCommentCardProps {
  notification: NotificationPostComment;
}
const NotificationPostCommentCard = ({
  notification,
}: NotificationPostCommentCardProps) => (
  <Link href={`post/${notification.postId}#${notification.comentId}`}>
    <a className="block">
      <NotificationCardWrapper
        imageUrl={notification.user.image}
        isRead={notification.isRead}
        notificationId={notification.id}
      >
        <p className="dark:text-primary-dark-600">
          <span className="font-medium text-primary-800 dark:text-primary-dark-800 mr-1">
            {notification.user.name}
          </span>
          commented your post
        </p>

        <ReactTimeAgo
          date={notification.createdAt}
          className="font-medium text-xs text-gray-400 dark:text-primary-dark-600"
        />
        <p className="text-primary-600 dark:text-primary-dark-600 text-sm italic mt-3 ring-2 ring-blue-400/30 rounded-md p-2">
          {notification.commentMessage}
        </p>
      </NotificationCardWrapper>
    </a>
  </Link>
);

export default NotificationPostCommentCard;
