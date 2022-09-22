import { z } from 'zod';
import { prisma } from '@/server/db/client';
import createProtectedRouter from '@/server/router/protected-router';
import { NotificationKind } from './types';

const notificationRouter = createProtectedRouter()
  .query('getAll', {
    input: z.object({
       unread: z.boolean().optional()
    }),

    async resolve({ ctx, input }) {
      const {unread} = input

      const notificationMentions = await prisma.notificationMention.findMany({
        where: {
          notification: {
            userId: ctx.session.user.id,
            isRead: unread ? false : undefined
          },
        },
        include: {
          notification: true,
          post: {
            include: {
              user: {
                select: {
                  image: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      const notificationsStartFollow =
        await prisma.notificationStartFollow.findMany({
          where: {
            notification: {
              userId: ctx.session.user.id,
              isRead: unread ? false : undefined
            },
          },
          include: {
            notification: true,
            userNotificationStartFollow: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        });

      const notificationsCommunityNewMember =
        await prisma.notificationCommunityNewMember.findMany({
          where: {
            notification: {
              userId: ctx.session.user.id,
              isRead: unread ? false : undefined
            },
          },
          include: {
            notification: true,
            user: {
              select: {
                id: true,
                image: true,
                name: true,
              },
            },
            community: true,
          },
        });

      const notificationsPostComment =
        await prisma.notificationPostComment.findMany({
          where: {
            notification: {
              userId: ctx.session.user.id,
              isRead: unread ? false : undefined
            },
          },
          include: {
            notification: true,
            comment: {
              include: {
                user: {
                  select: {
                    id: true,
                    image: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

      const notificationsCommentReply =
        await prisma.notificationCommentReply.findMany({
          where: {
            notification: {
              userId: ctx.session.user.id,
              isRead: unread ? false : undefined
            },
          },
          include: {
            notification: true,
            comment: {
              include: {
                user: {
                  select: {
                    id: true,
                    image: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

      const notifications = {
        notificationsMentions: notificationMentions.map((m) => ({
          id: m.notification.id,
          isRead: m.notification.isRead,
          createdAt: m.notification.createdAt,
          type: NotificationKind.MENTION,
          postId: m.postId,
          postContent: m.post.content,
          postAutor: {
            name: m.post.user.name,
            image: m.post.user.image,
          },
        })),
        notificationsStartFollow: notificationsStartFollow.map((n) => ({
          id: n.notification.id,
          isRead: n.notification.isRead,
          createdAt: n.notification.createdAt,
          type: NotificationKind.START_FOLLOW,
          user: n.userNotificationStartFollow,
          userId: n.userIdNotificationStartFollow,
        })),
        notificationsCommunityNewMember: notificationsCommunityNewMember.map(
          (n) => ({
            id: n.notification.id,
            isRead: n.notification.isRead,
            createdAt: n.notification.createdAt,
            type: NotificationKind.COMMUNITY_NEW_MEMBER,
            user: n.user,
            community: {
              id: n.communityId,
              name: n.community.name,
              image: n.community.image
            }
          })
        ),
        notificationsPostComment: notificationsPostComment.map((n) => ({
          id: n.notification.id,
          isRead: n.notification.isRead,
          createdAt: n.notification.createdAt,
          type: NotificationKind.POST_COMMENT,
          user: n.comment.user,
          commentMessage: n.comment.message,
          postId: n.comment.postId,
          comentId: n.commentId
        })),
        notificationsCommentReply: notificationsCommentReply.map((n) => ({
          id: n.notification.id,
          isRead: n.notification.isRead,
          createdAt: n.notification.createdAt,
          type: NotificationKind.COMMENT_REPLY,
          user: n.comment.user,
          commentMessage: n.comment.message,
          postId: n.comment.postId,
          comentId: n.commentId
        })),
      };

      return notifications;
    },
  })
  .query('count', {
    async resolve({ ctx }) {
      return prisma.notification.count({
        where: {
          userId: ctx.session.user.id,
          isRead: false,
        },
      });
    },
  })
  .mutation('markAsRead', {
    input: z.object({
      notificationId: z.string(),
    }),
    async resolve({ input }) {
      await prisma.notification.update({
        where: {
          id: input.notificationId,
        },
        data: {
          isRead: true,
        },
      });
    },
  })
  .mutation('markAllAsRead', {
    async resolve({ ctx }) {
      return prisma.notification.updateMany({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          isRead: true,
        },
      });
    },
  });

export default notificationRouter;
