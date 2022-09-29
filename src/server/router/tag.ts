/* eslint-disable no-underscore-dangle */
import { z } from 'zod';
import { prisma } from '@/server/db/client';
import createProtectedRouter from '@/server/router/protected-router';
import { getDateXDaysAgo } from './utils';

const tagRouter = createProtectedRouter()
  .query('getBySearchPhrase', {
    input: z.object({
      searchPhrase: z.string(),
    }),
    async resolve({ input }) {
      if (!input.searchPhrase) {
        return [];
      }
      const tags = await prisma.tag.findMany({
        where: {
          name: {
            contains: input.searchPhrase,
          },
        },
        orderBy: {
          name: 'asc',
        },
        take: 5,
      });
      return tags.map((tag) => tag.name);
    },
  })
  .query('trending', {
    async resolve() {
      const data = await prisma.postTag.groupBy({
        by: ['tagName'],
        where: {
          post: {
            isDeleted: false,
            createdAt: {
              gte: getDateXDaysAgo(7, new Date()),
            },
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
        take: 4,
      });

      return data.map((tagData) => ({
        tagName: tagData.tagName,
        postsCount: tagData._count.postId,
      }));
    },
  });

export default tagRouter;
