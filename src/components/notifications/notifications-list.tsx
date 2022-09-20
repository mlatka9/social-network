import {
  NotificationMentionsType,
  NotificationStartFollowType,
  NotificationsType,
} from '@/types/db';
import { NotificationKind } from '@/server/router/types';
import Loading from '../common/loading';
import NotificationMentionCard from './notification-mentions-card';
import NotificationsStartFollowCard from './notification-start-follow-card';

interface NotificationsListProps {
  notifications: NotificationsType | undefined;
}

const NotificationsList = ({ notifications }: NotificationsListProps) => {
  if (!notifications)
    return (
      <div className="space-y-5 ">
        <div className="dark:bg-primary-dark-200 bg-primary-0">
          <Loading height={64} />
        </div>
        <div className="dark:bg-primary-dark-200 bg-primary-0">
          <Loading height={70} />
        </div>
        <div className="dark:bg-primary-dark-200 bg-primary-0">
          <Loading height={64} />
        </div>
      </div>
    );

  const flattedNotifications = [
    ...notifications.notificationsMentions,
    ...notifications.notificationsStartFollow,
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const isNotificationMention = (
    notification: typeof flattedNotifications[number]
  ): notification is NotificationMentionsType =>
    notification.type === NotificationKind.MENTION;

  const isNotificationStartFollow = (
    notification: typeof flattedNotifications[number]
  ): notification is NotificationStartFollowType =>
    notification.type === NotificationKind.START_FOLLOW;

  return (
    <div className="space-y-5 mb-10">
      {flattedNotifications.map((n) => {
        if (isNotificationMention(n)) {
          return <NotificationMentionCard key={n.id} notification={n} />;
        }
        if (isNotificationStartFollow(n)) {
          return <NotificationsStartFollowCard key={n.id} notification={n} />;
          
        }
        throw new Error('Unsupported type');
      })}
    </div>
  );
};

export default NotificationsList;
