/* eslint-disable @typescript-eslint/naming-convention */
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import createProtectedRouter from '@/server/router/protected-router';
import { prisma } from '../db/client';
import {
  communityListInclude,
  getUsersListInclude,
  populateCommunitiesList,
  populateUsersList,
} from './utils';

const communityRouter = createProtectedRouter()
  .query('getAll', {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),

      categoryId: z.string().optional(),
      filter: z.string().optional(),
    }),
    async resolve({ input, ctx }) {
      const { cursor } = input;
      const limit = 10;

      let membersFilter: Prisma.UserCommunityListRelationFilter | undefined;

      if (input?.filter === 'joined') {
        membersFilter = {
          some: {
            userId: ctx.session.user.id,
          },
        };
      }

      if (input?.filter === 'owned') {
        membersFilter = {
          some: {
            role: 'ADMIN',
            userId: ctx.session.user.id,
          },
        };
      }

      const communities = await prisma.community.findMany({
        take: limit + 1,
        where: {
          category: {
            id: input?.categoryId,
          },
          favouriteBy:
            input?.filter === 'favourite'
              ? {
                  some: {
                    userId: ctx.session.user.id,
                  },
                }
              : undefined,
          members: membersFilter,
        },
        include: communityListInclude,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          members: {
            _count: 'desc',
          },
        },
      });

      const populatedList = populateCommunitiesList(
        communities,
        ctx.session.user.id
      );

      let nextCursor: typeof cursor | undefined;

      if (populatedList.length > limit) {
        const nextItem = populatedList.pop();
        nextCursor = nextItem!.id;
      }
      return {
        posts: populatedList,
        nextCursor,
      };
    },
  })
  .query('getById', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const community = await prisma.community.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          category: true,
          _count: true,
          favouriteBy: {
            select: {
              userId: true,
            },
          },
        },
      });

      const member = await prisma.userCommunity.findUnique({
        where: {
          userId_communityId: {
            userId: ctx.session.user.id,
            communityId: input.id,
          },
        },
      });

      const { _count, favouriteBy, ...communityData } = community;
      return {
        ...communityData,
        membersCount: _count.members,
        joinedByMe: !!member,
        isMyfavourite: favouriteBy.some(
          (user) => user.userId === ctx.session.user.id
        ),
        isOwner: member?.role === 'ADMIN',
      };
    },
  })
  .query('getMembers', {
    input: z.object({
      communityId: z.string(),
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

      const members = await prisma.user.findMany({
        where: {
          communities: {
            some: {
              communityId: input.communityId,
            },
          },
        },
        include: getUsersListInclude(myFollowingIds),
      });

      return populateUsersList(members, myFollowingIds);
    },
  })
  .mutation('addCommunity', {
    input: z.object({
      name: z.string(),
      categoryId: z.string(),
      description: z.string()
    }),
    async resolve({ ctx, input }) {
      return prisma.community.create({
        data: {
          name: input.name,
          description:input.description,
          category: {
            connect: {
              id: input.categoryId,
            },
          },
          members: {
            create: {
              role: 'ADMIN',
              userId: ctx.session.user.id,
            },
          },
        },
      });
    },
  })
  .mutation('markAsFavourite', {
    input: z.object({
      communityId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const favouriteCommunity = await prisma.favouriteCommunity.findUnique({
        where: {
          userId_communityId: {
            userId: ctx.session.user.id,
            communityId: input.communityId,
          },
        },
      });

      if (favouriteCommunity) {
        await prisma.favouriteCommunity.delete({
          where: {
            userId_communityId: {
              communityId: input.communityId,
              userId: ctx.session.user.id,
            },
          },
        });
      } else {
        await prisma.favouriteCommunity.create({
          data: {
            communityId: input.communityId,
            userId: ctx.session.user.id,
          },
        });
      }
    },
  })
  .query('popular', {
    async resolve() {
      const data = await prisma.userCommunity.groupBy({
        by: ['communityId'],
        _count: {
          communityId: true,
          userId: true,
        },
        orderBy: {
          _count: {
            userId: 'desc',
          },
        },
        take: 5,
      });

      const comminitiesIds = data.map(
        (userCommunity) => userCommunity.communityId
      );

      const comunitiesNames = await Promise.all(
        comminitiesIds.map((id) =>
          prisma.community.findFirstOrThrow({
            where: {
              id,
            },
            select: {
              name: true,
            },
          })
        )
      );

      return data.map(({ _count, ...userCommunityData }, index) => ({
        ...userCommunityData,
        communityName: comunitiesNames[index]?.name!,
        members: _count.userId,
      }));
    },
  })
  .query('getAllCategories', {
    async resolve() {
      const categores = await prisma.category.findMany({
        include: {
          _count: {
            select: {
              comunities: true,
            },
          },
        },
      });

      return categores.map(({ _count, ...categoryData }) => ({
        ...categoryData,
        communitiesCount: _count.comunities,
      }));
    },
  })
  .mutation('toggleMembership', {
    input: z.object({
      communityId: z.string(),
    }),
    async resolve({ input, ctx }) {

      const member = await prisma.userCommunity.findUnique({
        where: {
          userId_communityId: {
            userId: ctx.session.user.id,
            communityId: input.communityId,
          },
        },
      });

      if (member) {
        await prisma.userCommunity.delete({
          where: {
            userId_communityId: {
              communityId: input.communityId,
              userId: ctx.session.user.id,
            },
          },
        });
      } else {
        await prisma.userCommunity.create({
          data: {
            communityId: input.communityId,
            userId: ctx.session.user.id,
          },
        });

        const communityOwner = await prisma.userCommunity.findFirstOrThrow({
          where: {
            role: "ADMIN",
            communityId: input.communityId
          }
        })

        await prisma.notification.create({
          data: {
            userId: communityOwner.userId,
          }
        }).then(notification=>prisma.notificationCommunityNewMember.create({
            data: {
              notificationId: notification.id,
              communityId: input.communityId,
              userId: ctx.session.user.id
            }
          }))
      }
    },
  })
  .mutation('update', {
    input: z.object({
      communityId: z.string(),
      name: z.string(),
      description: z.string(),
      image: z.string().optional(),
      bannerImage: z.string().optional(),
      category: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const user = await prisma.userCommunity.findUnique({
        where: {
          userId_communityId: {
            communityId: input.communityId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (user?.role !== 'ADMIN') {
        throw new Error('You dont have permissions to modify this community');
      }

      await prisma.community.update({
        where: {
          id: input.communityId,
        },
        data: {
          name: input.name,
          description: input.description,
          image: input.image,
          bannerImage: input.bannerImage,
          categoryId: input.category,
        },
      });
    },
  });

export default communityRouter;
