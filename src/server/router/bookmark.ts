import { createProtectedRouter } from "./protected-router";
import { string, z } from "zod";
import { resolve } from "path";
import { prisma } from "../db/client";
import { createNextApiHandler } from "@trpc/server/adapters/next";

// Example router with queries that can only be hit if the user requesting is signed in
export const bookmarkRouter = createProtectedRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      const bookmarks = await prisma.post.findMany({
        where: {
          bookmarkedBy: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
        include: {
          user: true,
          images: true,
          likes: true,
          bookmarkedBy: true,
          _count: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return bookmarks.map((bookmark) => {
        const { _count, likes, bookmarkedBy, ...bookmarkData } = bookmark;
        return {
          ...bookmarkData,
          likesCount: _count.likes,
          commentsCount: _count.comments,
          likedByMe: likes.some(
            (postLike) => postLike.userId === ctx.session.user.id
          ),
          bookmarkedByMe: bookmarkedBy.some(
            (bookmark) => bookmark.userId === ctx.session.user.id
          ),
        };
      });
    },
  })
  .mutation("add", {
    input: z.object({
      postId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const data = {
        postId: input.postId,
        userId: ctx.session.user.id,
      };

      const bookmark = await prisma.bookmark.findUnique({
        where: {
          userId_postId: data,
        },
      });

      if (bookmark === null) {
        await prisma.bookmark.create({ data });
      } else {
        await prisma.bookmark.delete({
          where: {
            userId_postId: data,
          },
        });
      }
    },
  });
