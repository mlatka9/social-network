import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
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

      return comments
        .filter((comment) => comment._count.children > 0 || !comment.isDeleted)
        .map((comment) => {
          if (comment.isDeleted) {
            const { message, ...commentData } = comment;
            return {
              ...commentData,
              message: "Comment removed",
            };
          } else {
            return comment;
          }
        })
        .map(({ _count, likes, ...commentData }) => ({
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
  .mutation("delete", {
    input: z.object({
      commentId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const isCurretUserPostAuthor = await prisma.comment.count({
        where: {
          id: input.commentId,
          userId: ctx.session.user.id,
        },
      });
      if (!isCurretUserPostAuthor) {
        throw Error("You are not the owner of the post");
      }

      await prisma.comment.update({
        where: {
          id: input.commentId,
        },
        data: {
          isDeleted: true,
        },
      });
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
  })
  .mutation("update", {
    input: z.object({
      commentId: z.string(),
      newContent: z.string(),
    }),
    async resolve({ input, ctx }) {
      const isCurretUserPostAuthor = await prisma.comment.count({
        where: {
          id: input.commentId,
          userId: ctx.session.user.id,
        },
      });
      if (!isCurretUserPostAuthor) {
        throw Error("You are not the owner of the post");
      }

      await prisma.comment.update({
        where: {
          id: input.commentId,
        },
        data: {
          message: input.newContent,
        },
      });
    },
  });
