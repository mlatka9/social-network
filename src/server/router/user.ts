/* eslint-disable @typescript-eslint/naming-convention */
import { z } from 'zod';
import createProtectedRouter from './protected-router';
import { prisma } from '../db/client';
import { getUsersListInclude, populateUsersList } from './utils';

const userRouter = createProtectedRouter()
  .query('getById', {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const user = await prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        include: {
          followedBy: true,
          _count: {
            select: {
              followedBy: true,
              following: true,
            },
          },
        },
      });

      if (!user) throw new Error('no user with id');

      const { _count, followedBy, ...userData } = user;

      return {
        ...userData,
        followingCount: _count.following,
        followedByCount: _count.followedBy,
        followedByMe: followedBy.some(
          (follower) => follower.id === ctx.session.user.id
        ),
      };
    },
  })
  .query('me', {
    async resolve({ ctx }) {
      return ctx.session.user;
    },
  })
  .query('getFollowing', {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ input, ctx }) {
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

      const users = await prisma.user.findMany({
        where: {
          followedBy: {
            some: {
              id: input.userId,
            },
          },
        },
        include: getUsersListInclude(myFollowingIds),
      });

      return populateUsersList(users, myFollowingIds);
    },
  })
  .query('getFollowers', {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ input, ctx }) {
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

      const users = await prisma.user.findMany({
        where: {
          following: {
            some: {
              id: input.userId,
            },
          },
        },
        include: getUsersListInclude(myFollowingIds),
      });

      return populateUsersList(users, myFollowingIds);
    },
  })
  .query('getBySearchPhrase', {
    input: z.object({
      searchPhrase: z.string(),
    }),

    async resolve({ input }) {
      if (!input.searchPhrase) {
        return [];
      }
      const matchingUsers = await prisma.user.findMany({
        where: {
          name: {
            contains: input.searchPhrase,
          },
        },
        select: {
          id: true,
          name: true,
        },
        take: 5,
      });

      return matchingUsers;
    },
  })
  .mutation('followUser', {
    input: z.object({
      userId: z.string(),
    }),

    async resolve({ ctx, input }) {
      if (input.userId === ctx.session.user.id) {
        throw new Error('U cant follow yourself');
      }

      const user = await prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          following: true,
        },
      });

      const isUserFollowed =
        user?.following.some((u) => u.id === input.userId) || false;

      await prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          following: isUserFollowed
            ? {
                disconnect: {
                  id: input.userId,
                },
              }
            : {
                connect: {
                  id: input.userId,
                },
              },
        },
      });

      if(!isUserFollowed) {
        await prisma.notification.create({
          data: {
            userId: input.userId,
          }
        }).then(notification=>prisma.notificationStartFollow.create({
            data: {
              notificationId: notification.id,
              userIdNotificationStartFollow: ctx.session.user.id
            }
          }))
      }

    },
  })
  .mutation('update', {
    input: z.object({
      name: z.string(),
      bio: z.string(),
      image: z.string().optional(),
      bannerImage: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      await prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          bio: input.bio,

          image: input.image,
          bannerImage: input.bannerImage,
        },
      });
    },
  });

export default userRouter;
