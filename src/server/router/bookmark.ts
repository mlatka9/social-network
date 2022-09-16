import { z } from 'zod';
import { prisma } from '@/server/db/client';
import createProtectedRouter from '@/server/router/protected-router';
import {
  postDetailsInclude,
  populatePost,
  getMyFollowingIds,
} from '@/server/router/utils';

const bookmarkRouter = createProtectedRouter()
  .query('getAll', {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }),
    async resolve({ ctx, input }) {
      const { cursor } = input;
      const limit = input.limit ?? 10;

      const posts = await prisma.post.findMany({
        take: limit + 1,
        where: {
          bookmarkedBy: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
        include: postDetailsInclude,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });

      const myFollowingIds = await getMyFollowingIds(ctx.session.user.id);

      const populatedPosts = posts.map((post) =>
        populatePost(post, ctx.session.user.id, myFollowingIds)
      );

      // eslint-disable-next-line no-undef-init
      let nextCursor: typeof cursor | undefined = undefined;

      if (populatedPosts.length > limit) {
        const nextItem = populatedPosts.pop();
        nextCursor = nextItem!.id;
      }
      return {
        posts: populatedPosts,
        nextCursor,
      };
    },
  })
  .mutation('add', {
    input: z.object({
      postId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const data = {
        postId: input.postId,
        userId: ctx.session.user.id,
      };

      const bookmark = await prisma.bookmark.findUnique({
        where: {
          userId_postId: data,
        },
      });

      if (bookmark === null) {
        await prisma.bookmark.create({ data });
      } else {
        await prisma.bookmark.delete({
          where: {
            userId_postId: data,
          },
        });
      }
    },
  });

export default bookmarkRouter;
