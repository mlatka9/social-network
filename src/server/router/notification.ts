import { z } from 'zod';
import { prisma } from '@/server/db/client';
import createProtectedRouter from '@/server/router/protected-router';

const notificationRouter = createProtectedRouter()
  .query('getAll', {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }),
    async resolve({ ctx, input }) {
      const { cursor } = input;
      const limit = input.limit ?? 10;
      const mentions = await prisma.mention.findMany({
        take: limit + 1,
        where: {
          userId: ctx.session.user.id,
          isReaded: false,
          post: {
            isDeleted: false,
            NOT: {
              userId: ctx.session.user.id,
            },
          },
        },
        include: {
          post: {
            select: {
              id: true,
              user: {
                select: {
                  image: true,
                  name: true,
                },
              },
            },
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });

      // eslint-disable-next-line no-undef-init
      let nextCursor: typeof cursor | undefined = undefined;

      if (mentions.length > limit) {
        const nextItem = mentions.pop();
        nextCursor = nextItem!.id;
      }
      return {
        notifications: mentions,
        nextCursor,
      };
    },
  })
  .query('count', {
    async resolve({ ctx }) {
      return prisma.mention.count({
        where: {
          userId: ctx.session.user.id,
          isReaded: false,
          post: {
            isDeleted: false,
            NOT: {
              userId: ctx.session.user.id,
            },
          },
        },
      });
    },
  })
  .mutation('markAsRead', {
    input: z.object({
      notificationId: z.string(),
    }),
    async resolve({ input }) {
      return prisma.mention.update({
        where: {
          id: input.notificationId,
        },
        data: {
          isReaded: true,
        },
      });
    },
  })
  .mutation('markAllAsRead', {
    async resolve({ ctx }) {
      return prisma.mention.updateMany({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          isReaded: true,
        },
      });
    },
  });

export default notificationRouter;
