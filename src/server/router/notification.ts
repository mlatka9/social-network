import { z } from 'zod';
import { prisma } from '@/server/db/client';
import createProtectedRouter from '@/server/router/protected-router';

const notificationRouter = createProtectedRouter().query('getAll', {
  input: z.object({
    limit: z.number().min(1).max(100).nullish(),
    cursor: z
      .object({
        postId: z.string(),
        userId: z.string(),
      })
      .nullish(),
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
          isNot: {
            isDeleted: true,
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
      cursor: cursor ? { userId_postId: cursor } : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // eslint-disable-next-line no-undef-init
    let nextCursor: typeof cursor | undefined = undefined;

    if (mentions.length > limit) {
      const nextItem = mentions.pop();
      nextCursor = { userId: nextItem!.userId, postId: nextItem!.postId };
    }
    return {
      notifications: mentions,
      nextCursor,
    };
  },
});

export default notificationRouter;
