/* eslint-disable @typescript-eslint/naming-convention */
import { boolean, string, z } from 'zod';
import { TRPCError } from '@trpc/server';
import {
  populatePost,
  postDetailsInclude,
  getDateXDaysAgo,
  getMyFollowingIds,
} from '@/server/router/utils';
import createProtectedRouter from './protected-router';
import { prisma } from '../db/client';

const getCreatedAtCondition = (time: 'day' | 'week') => {
  if (time === 'day') return getDateXDaysAgo(1, new Date());
  if (time === 'week') return getDateXDaysAgo(7, new Date());
  throw new Error('wrong time');
};

const postRouter = createProtectedRouter()
  .query('getById', {
    input: z.object({
      postId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const post = await prisma.post.findFirstOrThrow({
        where: {
          id: input.postId,
        },
        include: postDetailsInclude,
      });

      if (post.isDeleted) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post was deleted',
        });
      }
      const myFollowingIds = await getMyFollowingIds(ctx.session.user.id);
      return populatePost(post, ctx.session.user.id, myFollowingIds);
    },
  })
  .query('getInfiniteFeed', {
    input: z.object({
      cursor: z.string().nullish(),
      sort: z.enum(['top']).optional(),
      time: z.enum(['day', 'week']).optional(),
    }),
    async resolve({ ctx, input }) {
      const { cursor } = input;
      const limit = 5;

      const posts = await prisma.post.findMany({
        take: limit + 1,
        where: {
          OR: [
            {
              user: {
                followedBy: {
                  some: {
                    id: ctx.session.user.id,
                  },
                },
              },
            },
            {
              community: {
                members: {
                  some: {
                    userId: ctx.session.user.id,
                  },
                },
              },
            },
            {
              sharedBy: {
                some: {
                  user: {
                    followedBy: {
                      some: {
                        id: ctx.session.user.id,
                      },
                    },
                  },
                },
              },
            },
            {
              likes: {
                some: {
                  user: {
                    followedBy: {
                      some: {
                        id: ctx.session.user.id,
                      },
                    },
                  },
                },
              },
            },
          ],
          createdAt:
            input.sort === 'top' &&
            (input.time === 'day' || input.time === 'week')
              ? {
                  gte: getCreatedAtCondition(input.time),
                }
              : undefined,
          isDeleted: false,
          NOT: { userId: ctx.session.user.id },
        },
        include: postDetailsInclude,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy:
          input.sort === 'top'
            ? {
                likes: {
                  _count: 'desc',
                },
              }
            : {
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
  .query('getAll', {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),

      userId: z.string().optional(),
      tagName: z.string().optional(),
      communityId: z.string().optional(),

      sort: z.enum(['top']).optional(),
      time: z.enum(['day', 'week']).optional(),
      withImage: boolean().optional(),
      likedByUsedId: string().optional(),
    }),
    async resolve({ ctx, input }) {
      const { cursor } = input;
      const limit = input.limit ?? 10;

      const posts = await prisma.post.findMany({
        take: limit + 1,
        where: {
          createdAt:
            input.sort === 'top' &&
            (input.time === 'day' || input.time === 'week')
              ? {
                  gte: getCreatedAtCondition(input.time),
                }
              : undefined,
          OR: input.userId
            ? [
                {
                  user: {
                    id: input.userId,
                  },
                },
                {
                  sharedBy: input.userId
                    ? {
                        some: {
                          userId: input.userId,
                        },
                      }
                    : undefined,
                },
              ]
            : undefined,
          community: {
            id: input.communityId,
          },
          tags: input.tagName
            ? {
                some: {
                  tagName: input.tagName,
                },
              }
            : undefined,
          isDeleted: false,
          images: input.withImage
            ? {
                some: {},
              }
            : undefined,
          likes: input.likedByUsedId
            ? {
                some: {
                  userId: input.likedByUsedId,
                },
              }
            : undefined,
        },
        include: postDetailsInclude,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy:
          input.sort === 'top'
            ? {
                likes: {
                  _count: 'desc',
                },
              }
            : {
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
  .mutation('addPost', {
    input: z.object({
      isQuoteShare: z.boolean().optional(),
      content: z.string(),
      link: z.string().optional(),
      images: z
        .array(
          z.object({
            imageUrl: z.string(),
            imageAlt: z.string(),
            width: z.number(),
            height: z.number(),
            fallbackUrl: z.string(),
          })
        )
        .nullable(),
      tags: z.array(z.string()).nullable(),
      mentions: z.array(z.string()).nullable(),
      shareParentId: z.string().optional(),
      communityId: z.string().optional(),
    }),
    async resolve({ input, ctx }) {
      if (!input.content) {
        throw new Error('Post must have content text');
      }

      const trimmedContent = input.content.trim();

      if (trimmedContent.length === 0) {
        throw new Error('Post must have content text');
      }

      if (trimmedContent.length > 280) {
        throw new Error('Post content must be up to 280 characters');
      }

      let formattedLink = input.link;
      if (input.link && !/^(http:\/\/|https:\/\/)/i.test(input.link)) {
        formattedLink = `http://${input.link}`;
      }

      const post = await prisma.post.create({
        data: {
          content: input.content,
          userId: ctx.session.user.id,
          shareParentId: input.shareParentId,
          communityId: input.communityId,
          link: formattedLink,
        },
      });

      if (input.mentions?.length) {
        await prisma.mention.createMany({
          data: input.mentions?.map((mention) => ({
            postId: post.id,
            userId: mention,
          })),
        });

        const filteredMentions = input.mentions.filter(mention=>mention !== ctx.session.user.id)

        const mentions = filteredMentions.map((m) =>
          prisma.notification
            .create({
              data: {
                userId: m,
              },
            })
            .then((notification) => prisma.notificationMention.create({
                data: {
                  notificationId: notification.id,
                  postId: post.id,
                },
              }))
        );

        await Promise.all(mentions);
      }

      if (input.images?.length) {
        await prisma.image.createMany({
          data: input.images.map((image) => ({
            fallbackUrl: image.fallbackUrl,
            alt: image.imageAlt,
            url: image.imageUrl,
            postId: post.id,
            width: image.width,
            height: image.height,
          })),
        });
      }

      const getRandomColor = () =>
        // eslint-disable-next-line no-bitwise, prefer-template
        '#' + (((1 << 24) * Math.random()) | 0).toString(16);

      if (input.tags) {
        const tagsAlreadyInDB = await prisma.tag.findMany({
          where: {
            name: {
              in: input.tags.map((tag) => tag),
            },
          },
        });

        const tagsNameAlreadyInDB = tagsAlreadyInDB.map((tag) => tag.name);

        await prisma.tag.createMany({
          data: input.tags
            .filter((tag) => !tagsNameAlreadyInDB.includes(tag))
            .map((tag) => ({
              name: tag,
              color: getRandomColor(),
            })),
        });

        const tags = await prisma.tag.findMany({
          where: {
            name: {
              in: input.tags.map((tag) => tag),
            },
          },
        });

        await prisma.postTag.createMany({
          data: tags.map((tag) => ({ tagName: tag.name, postId: post.id })),
        });
      }
    },
  })
  .mutation('toggleShare', {
    input: z.object({
      postId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const data = {
        postId: input.postId,
        userId: ctx.session.user.id,
      };
      const userShare = await prisma.userShare.findUnique({
        where: {
          userId_postId: data,
        },
      });

      if (userShare === null) {
        await prisma.userShare.create({ data });
      } else {
        await prisma.userShare.delete({
          where: {
            userId_postId: data,
          },
        });
      }
    },
  })
  .mutation('toggleLike', {
    input: z.object({
      postId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const data = {
        postId: input.postId,
        userId: ctx.session.user.id,
      };
      const like = await prisma.postLike.findUnique({
        where: {
          userId_postId: data,
        },
      });

      if (like === null) {
        await prisma.postLike.create({ data });
      } else {
        await prisma.postLike.delete({
          where: {
            userId_postId: data,
          },
        });
      }

      const updatedPost = await prisma.post.findUniqueOrThrow({
        where: {
          id: input.postId,
        },
        include: {
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });

      const { _count, ...postData } = updatedPost;

      return {
        updatedPost: {
          ...postData,
          likesCount: _count.likes,
          likedByMe: like === null,
        },
      };
    },
  })
  .mutation('remove', {
    input: z.object({
      postId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const isCurrentUserPostAuthor = await prisma.post.count({
        where: {
          id: input.postId,
          userId: ctx.session.user.id,
        },
      });
      if (!isCurrentUserPostAuthor) {
        throw Error('You are not the owner of the post');
      }

      await prisma.post.update({
        where: {
          id: input.postId,
        },
        data: {
          isDeleted: true,
        },
      });
    },
  });

export default postRouter;
