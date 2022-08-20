import { createProtectedRouter } from "./protected-router";
import { string, z } from "zod";
import { resolve } from "path";
import { prisma } from "../db/client";
import { Prisma } from "@prisma/client";

const postWithUserAndImages = Prisma.validator<Prisma.PostArgs>()({
  include: {
    images: true,
    tags: {
      include: {
        tag: true,
      },
    },
    user: true,
    _count: true,
    likes: true,
    bookmarkedBy: true,
  },
});

type PostWithUserAndImages = Prisma.PostGetPayload<
  typeof postWithUserAndImages
>;

type PostCardProps = PostWithUserAndImages;

const populatePost = (post: PostCardProps, userId: string) => {
  const { _count, likes, bookmarkedBy, tags, ...postData } = post;
  return {
    ...postData,
    tags: post.tags.map((tag) => tag.tag),
    likesCount: _count.likes,
    commentsCount: _count.comments,
    likedByMe: likes.some((postLike) => postLike.userId === userId),
    bookmarkedByMe: bookmarkedBy.some((bookmark) => bookmark.userId === userId),
  };
};

// Example router with queries that can only be hit if the user requesting is signed in
export const postRouter = createProtectedRouter()
  .query("getById", {
    input: z.object({
      postId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const post = await prisma.post.findFirstOrThrow({
        where: {
          id: input.postId,
        },
        include: {
          user: true,
          likes: true,
          images: true,
          tags: {
            include: {
              tag: true,
            },
          },
          _count: true,
          bookmarkedBy: true,
        },
      });

      return populatePost(post, ctx.session.user.id);
    },
  })
  .query("getInfiniteFeed", {
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
          user: {
            followedBy: {
              some: {
                id: ctx.session.user.id,
              },
            },
          },
        },
        include: {
          user: true,
          images: true,
          likes: true,
          tags: {
            include: {
              tag: true,
            },
          },
          bookmarkedBy: true,
          _count: true,
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });

      const populatedPosts = posts.map((post) =>
        populatePost(post, ctx.session.user.id)
      );

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
  .query("getAll", {
    input: z
      .object({
        userId: string().optional(),
      })
      .optional(),
    async resolve({ ctx, input }) {
      const posts = await prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId: input?.userId || undefined,
        },
        include: {
          user: true,
          images: true,
          tags: {
            include: {
              tag: true,
            },
          },
          likes: true,
          _count: true,
          bookmarkedBy: true,
        },
      });

      return posts.map((post) => populatePost(post, ctx.session.user.id));
    },
  })
  .mutation("addPost", {
    input: z.object({
      content: z.string(),
      images: z
        .array(
          z.object({
            imageUrl: z.string(),
            imageAlt: z.string(),
          })
        )
        .nullable(),
      tags: z
        .array(
          z.object({
            name: z.string(),
            status: z.enum(["new", "created"]),
            color: z.string(),
          })
        )
        .nullable(),
    }),
    async resolve({ input, ctx }) {
      if (input.content.trim().length === 0) {
        throw new Error("Post must have content text");
      }

      const post = await prisma.post.create({
        data: {
          content: input.content,
          userId: ctx.session.user.id,
        },
      });

      if (input.images) {
        await prisma.image.createMany({
          data: input.images.map((image) => ({
            alt: image.imageAlt,
            url: image.imageUrl,
            postId: post.id,
          })),
        });
      }

      const getRandomColor = () => {
        return "#" + (((1 << 24) * Math.random()) | 0).toString(16);
      };

      if (input.tags) {
        const newTags = input.tags.filter((tag) => tag.status === "new");

        await prisma.tag.createMany({
          data: newTags.map((tag) => ({
            name: tag.name,
            color: getRandomColor(),
          })),
        });

        const tags = await prisma.tag.findMany({
          where: {
            name: {
              in: input.tags.map((tag) => tag.name),
            },
          },
        });

        console.log("TAGGGSSSS", tags);

        await prisma.postTag.createMany({
          data: tags.map((tag) => ({ tagId: tag.id, postId: post.id })),
        });
      }
    },
  })
  .mutation("toggleLike", {
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
  });
