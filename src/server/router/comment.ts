import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import { resolve } from "path";
import { prisma } from "../db/client";

// Example router with queries that can only be hit if the user requesting is signed in
export const commentRouter = createProtectedRouter()
  .query("getAllByPostId", {
    input: z.object({
      postId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const comments = await prisma.comment.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          postId: input.postId,
        },
        include: {
          _count: true,
          likes: true,
          user: true,
          children: {
            select: {
              _count: true,
            },
          },
        },
      });

      return comments.map(({ _count, likes, ...commentData }) => ({
        ...commentData,
        likeCount: _count.likes,
        repliesCount: _count.children,
        likedByMe: likes.some(
          (postLike) => postLike.userId === ctx.session.user.id
        ),
      }));
    },
  })
  .mutation("add", {
    input: z.object({
      postId: z.string(),
      parentId: z.string().nullable(),
      message: z.string(),
    }),
    async resolve({ input, ctx }) {
      const createdComment = await prisma.comment.create({
        data: {
          message: input.message,
          parentId: input.parentId,
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
      const comment = await prisma.comment.findFirstOrThrow({
        where: {
          id: createdComment.id,
        },
        include: {
          _count: true,
          likes: true,
        },
      });

      const { _count, likes, ...commentData } = comment;

      return {
        ...commentData,
        likeCount: _count.likes,
        likedByMe: likes.some(
          (postLike) => postLike.userId === ctx.session.user.id
        ),
      };
    },
  })
  .mutation("toggleLike", {
    input: z.object({
      commentId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const data = {
        userId: ctx.session.user.id,
        commentId: input.commentId,
      };
      const like = await prisma.commentLike.findFirst({ where: data });

      if (like) {
        await prisma.commentLike.delete({
          where: {
            userId_commentId: data,
          },
        });
      } else {
        await prisma.commentLike.create({
          data,
        });
      }

      const updatedComment = await prisma.comment.findFirstOrThrow({
        where: {
          id: input.commentId,
        },
        include: {
          user: true,
        },
      });

      return {
        ...updatedComment,
        likedByMe: like === null,
        likeCount: await prisma.commentLike.count({
          where: {
            commentId: input.commentId,
          },
        }),
      };
    },
  });
