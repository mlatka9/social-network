import { z } from 'zod';
import { prisma } from '@/server/db/client';
import createProtectedRouter from '@/server/router/protected-router';
import { NotificationKind } from './types';

const notificationRouter = createProtectedRouter()
  .query('getAll', {
    async resolve({ ctx }) {
      const notificationMentions = await prisma.notificationMention.findMany({
        where: {
          notification: {
            userId: ctx.session.user.id,
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

      const notifications = {
        notificationsMentions: notificationMentions.map(
          (m) => ({
            id: m.id,
            isRead: m.notification.isRead,
            createdAt: m.notification.createdAt,
            type: NotificationKind.MENTION,
            postId: m.postId,
            postAutor: {
              name: m.post.user.name,
              image: m.post.user.image
            }
          })
        ),
        notificationsStartFollow: notificationsStartFollow.map((n) => ({
          id: n.id,
          isRead: n.notification.isRead,
          createdAt: n.notification.createdAt,
          type: NotificationKind.START_FOLLOW,
          user: n.userNotificationStartFollow,
          userId: n.userIdNotificationStartFollow
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
      return prisma.notification.update({
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
