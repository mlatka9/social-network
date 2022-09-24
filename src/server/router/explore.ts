import { z } from 'zod';
import createProtectedRouter from './protected-router';
import { prisma } from '../db/client';
import {
  communityListInclude,
  getUsersListInclude,
  populateCommunitiesList,
  populateUsersList,
} from './utils';

const exploreRouter = createProtectedRouter()
  .query('getSuggestedUsers', {
    input: z
      .object({
        limit: z.number().min(1).optional(),
      })
      .optional(),
    async resolve({ ctx, input }) {
      const limit = input?.limit || 10;
      const myFollowing = await prisma.user.findMany({
        where: {
          followedBy: {
            some: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      const myFollowingIds = myFollowing.map((user) => user.id);

      const suggestedUsers = await prisma.user.findMany({
        where: {
          followedBy: {
            some: {
              id: {
                in: myFollowingIds,
              },
            },
          },
          id: {
            notIn: [...myFollowingIds, ctx.session.user.id],
          },
        },
        include: getUsersListInclude(myFollowingIds),
      });

      const suggestedUsersIds = suggestedUsers.map((user) => user.id);

      const popularUsers = await prisma.user.findMany({
        where: {
          id: {
            notIn: [
              ...myFollowingIds,
              ...suggestedUsersIds,
              ctx.session.user.id,
            ],
          },
        },
        include: {
          followedBy: true,
          _count: {
            select: {
              followedBy: true,
            },
          },
        },
        orderBy: {
          followedBy: {
            _count: 'desc',
          },
        },
        take: limit,
      });

      const populatedPopularUsers = populateUsersList(
        popularUsers,
        myFollowingIds
      );

      const populatedSuggestedUsers = populateUsersList(
        suggestedUsers,
        myFollowingIds
      );

      return [...populatedSuggestedUsers, ...populatedPopularUsers].slice(
        0,
        limit
      );
    },
  })
  .query('getSuggestedCommunities', {
    input: z
      .object({
        limit: z.number().min(1).optional(),
      })
      .optional(),
    async resolve({ ctx, input }) {
      const limit = input?.limit || 10;
      const userCommunities = await prisma.community.findMany({
        where: {
          members: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      });

      const userCommunitiesIds = userCommunities.map((user) => user.id);
      const userCommunitiesCategoryIds = userCommunities.map(
        (user) => user.categoryId
      );

      const suggestedCommunities = await prisma.community.findMany({
        where: {
          categoryId: {
            in: userCommunitiesCategoryIds,
          },
          id: {
            notIn: userCommunitiesIds,
          },
        },
        include: communityListInclude,
      });

      const suggestedCommunitiesIds = suggestedCommunities.map(
        (community) => community.id
      );

      const popularCommunities = await prisma.community.findMany({
        where: {
          id: {
            notIn: [...userCommunitiesIds, ...suggestedCommunitiesIds],
          },
        },
        include: communityListInclude,
        take: limit,
      });

      const populatedSuggestedCommunities = populateCommunitiesList(
        suggestedCommunities,
        ctx.session.user.id
      );

      const populatedPopularCommunitiesList = populateCommunitiesList(
        popularCommunities,
        ctx.session.user.id
      );

      return [
        ...populatedSuggestedCommunities,
        ...populatedPopularCommunitiesList,
      ].slice(0, limit);
    },
  });

export default exploreRouter;
