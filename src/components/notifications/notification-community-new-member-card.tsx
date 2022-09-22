/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { NotificationCommunityNewMember } from '@/types/db';
import Link from 'next/link';
import ReactTimeAgo from 'react-time-ago';
import NotificationCardWrapper from './notification-card-wrapper';

interface NotificationsCommunityNewMemberCardProps {
  notification: NotificationCommunityNewMember;
}

const NotificationsCommunityNewMemberCard = ({
  notification,
}: NotificationsCommunityNewMemberCardProps) => (
  <Link href={`community/${notification.community.id}`}>
    <a className="block">
      <NotificationCardWrapper
        imageUrl={notification.community.image}
        isRead={notification.isRead}
        notificationId={notification.id}
      >
        <p className="dark:text-primary-dark-600">
          <span className="font-medium text-primary-800 dark:text-primary-dark-800 mr-1">
            {notification.user.name}
          </span>
          has joinned to your community{' '}
          <span className="font-medium text-primary-800 dark:text-primary-dark-800 mr-1">
            {notification.community.name}
          </span>
        </p>
        <ReactTimeAgo
          date={notification.createdAt}
          className="font-medium text-xs text-gray-400 dark:text-primary-dark-600"
        />
      </NotificationCardWrapper>
    </a>
  </Link>
);

export default NotificationsCommunityNewMemberCard;
