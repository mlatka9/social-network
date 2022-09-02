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
    async resolve({ ctx }) {
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

      return populateUsersList(suggestedUsers, myFollowingIds);
    },
  })
  .query('getSuggestedCommunities', {
    async resolve({ ctx }) {
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
      return populateCommunitiesList(suggestedCommunities, ctx.session.user.id);
    },
  });

export default exploreRouter;
