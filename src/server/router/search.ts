/* eslint-disable no-underscore-dangle */
import { z } from 'zod';
import createProtectedRouter from '@/server/router/protected-router';
import { prisma } from '../db/client';
import { SearchType } from './types';

const searchRouter = createProtectedRouter().query('getBySearchPhrase', {
  input: z.object({
    searchPhrase: z.string(),
  }),

  async resolve({ input }) {
    if (!input.searchPhrase.trim()) {
      return [];
    }
    const matchingUsers = await prisma.user.findMany({
      where: {
        name: {
          contains: input.searchPhrase,
        },
      },
      include: {
        _count: {
          select: {
            followedBy: true,
          },
        },
      },
      take: 5,
    });

    const matchingCommunities = await prisma.community.findMany({
      where: {
        name: {
          contains: input.searchPhrase,
        },
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
      take: 5,
    });

    const matchingUsersWithFollows = matchingUsers.map((user) => ({
      type: SearchType.USER,
      id: user.id,
      title: user.name,
      image: user.image,
      followersCount: user._count.followedBy,
    }));

    const matchingCommunitiesWithFollows = matchingCommunities.map(
      (comunity) => ({
        type: SearchType.COMMUNITY,
        id: comunity.id,
        title: comunity.name,
        image: comunity.image,
        followersCount: comunity._count.members,
      })
    );

    return [...matchingUsersWithFollows, ...matchingCommunitiesWithFollows]
      .sort((a, b) => b.followersCount - a.followersCount)
      .slice(0, 5);
  },
});

export default searchRouter;
