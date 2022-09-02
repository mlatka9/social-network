/* eslint-disable no-underscore-dangle */
import { z } from 'zod';
import { prisma } from '@/server/db/client';
import createProtectedRouter from '@/server/router/protected-router';

const tagRouter = createProtectedRouter()
  .query('getBySearchPhrase', {
    input: z.object({
      searchPhrase: z.string(),
    }),
    async resolve({ input }) {
      if (!input.searchPhrase) {
        return [];
      }
      return prisma.tag.findMany({
        where: {
          name: {
            contains: input.searchPhrase,
          },
        },
        take: 5,
      });
    },
  })
  .query('trending', {
    async resolve() {
      const data = await prisma.postTag.groupBy({
        by: ['tagName'],
        where: {
          post: {
            isDeleted: false,
          },
        },
        _count: {
          postId: true,
        },
        orderBy: {
          _count: {
            postId: 'desc',
          },
        },
        take: 5,
      });

      return data.map((tagData) => ({
        tagName: tagData.tagName,
        postsCount: tagData._count.postId,
      }));
    },
  });

export default tagRouter;
