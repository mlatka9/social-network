import { useNotificationsQuery } from "@/hooks/query";
import { NotificationKind } from "@/server/router/types";
import { useRouter } from "next/router";
import {
    NotificationMentionsType,
    NotificationStartFollowType,
    NotificationCommunityNewMember,
    NotificationPostComment,
    NotificationCommentReply,
  } from '@/types/db';


const useNotificationList = () => {
    const router = useRouter();

    const filter = router.query?.filter as string | undefined;
    const isShowUnread = filter === 'unread';
  
    const { data: notifications, isSuccess } = useNotificationsQuery(isShowUnread);

    if(!isSuccess) return {isSuccess};
    
    const flattedNotifications = [
        ...notifications.notificationsMentions,
        ...notifications.notificationsStartFollow,
        ...notifications.notificationsCommunityNewMember,
        ...notifications.notificationsPostComment,
        ...notifications.notificationsCommentReply,
      ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
      const isNotificationMention = (
        notification: typeof flattedNotifications[number]
      ): notification is NotificationMentionsType =>
        notification.type === NotificationKind.MENTION;
    
      const isNotificationStartFollow = (
        notification: typeof flattedNotifications[number]
      ): notification is NotificationStartFollowType =>
        notification.type === NotificationKind.START_FOLLOW;
    
      const isNotificationCommunityNewMember = (
        notification: typeof flattedNotifications[number]
      ): notification is NotificationCommunityNewMember =>
        notification.type === NotificationKind.COMMUNITY_NEW_MEMBER;
    
      const isNotificationsPostComment = (
        notification: typeof flattedNotifications[number]
      ): notification is NotificationPostComment =>
        notification.type === NotificationKind.POST_COMMENT;
    
      const isNotificationCommentReply = (
        notification: typeof flattedNotifications[number]
      ): notification is NotificationCommentReply =>
        notification.type === NotificationKind.COMMENT_REPLY;

        return ({
            isSuccess,
            flattedNotifications,
            isNotificationMention,
            isNotificationStartFollow,
            isNotificationCommunityNewMember,
            isNotificationsPostComment,
            isNotificationCommentReply
        })
}

export default useNotificationList;