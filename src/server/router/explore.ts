import createProtectedRouter from './protected-router';
import { prisma } from '../db/client';

const exploreRouter = createProtectedRouter().query('getSuggestedUsers', {
  async resolve({ ctx }) {
    const userFollowing = await prisma.user.findMany({
      where: {
        followedBy: {
          some: {
            id: ctx.session.user.id,
          },
        },
      },
    });

    const userFollowsIds = userFollowing.map((user) => user.id);

    const suggestedUsers = await prisma.user.findMany({
      where: {
        followedBy: {
          some: {
            id: {
              in: userFollowsIds,
            },
          },
        },
        id: {
          notIn: [...userFollowsIds, ctx.session.user.id],
        },
      },
      include: {
        followedBy: {
          where: {
            id: {
              in: userFollowsIds,
            },
          },
          select: {
            id: true,
            name: true,
          },
          // take: 1,
        },
        _count: {
          select: {
            followedBy: true,
          },
        },
      },
    });

    return suggestedUsers.map(
      ({
        _count,
        bannerImage,
        emailVerified,
        followedBy,
        ...suggestedUserData
      }) => ({
        ...suggestedUserData,
        mutualUsers: followedBy,
        followersCount: _count.followedBy,
      })
    );
  },
});

export default exploreRouter;
