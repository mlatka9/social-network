import Loading from '../common/loading';
import NotificationMentionCard from './notification-mentions-card';
import NotificationsStartFollowCard from './notification-start-follow-card';
import NotificationsCommunityNewMemberCard from './notification-community-new-member-card';
import NotificationPostCommentCard from './notification-post-comment-card';
import NotificationCommentReplyCard from './notification-comment-reply-card';
import useNotificationList from './use-notification-list';
import FallbackCard from '../common/fallback-card';

const NotificationsList = () => {
  const {
    isSuccess,
    flattedNotifications,
    isNotificationCommentReply,
    isNotificationCommunityNewMember,
    isNotificationMention,
    isNotificationStartFollow,
    isNotificationsPostComment,
  } = useNotificationList();

  if (!isSuccess)
    return (
      <div className="space-y-5 ">
        <div className="dark:bg-primary-dark-200 bg-primary-0">
          <Loading height={300} />
        </div>
      </div>
    );

  if (isSuccess && !flattedNotifications.length) {
    return (
      <FallbackCard>
        when something important happens, we&apos;ll let you know about it 😉
      </FallbackCard>
    );
  }

  return (
    <div className="space-y-5 mb-10">
      {flattedNotifications.map((n) => {
        if (isNotificationCommentReply(n)) {
          return <NotificationCommentReplyCard key={n.id} notification={n} />;
        }
        if (isNotificationMention(n)) {
          return <NotificationMentionCard key={n.id} notification={n} />;
        }
        if (isNotificationStartFollow(n)) {
          return <NotificationsStartFollowCard key={n.id} notification={n} />;
        }
        if (isNotificationsPostComment(n)) {
          return <NotificationPostCommentCard key={n.id} notification={n} />;
        }
        if (isNotificationCommunityNewMember(n)) {
          return (
            <NotificationsCommunityNewMemberCard key={n.id} notification={n} />
          );
        }
        throw new Error('Unsupported type');
      })}
    </div>
  );
};

export default NotificationsList;
