import { createProtectedRouter } from "./protected-router";
import { string, z } from "zod";
import { resolve } from "path";
import { prisma } from "../db/client";

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
          _count: true,
        },
      });

      const { _count, likes, ...postData } = post;

      return {
        ...postData,
        likesCount: _count.likes,
        commentsCount: _count.comments,
        likedByMe: likes.some(
          (postLike) => postLike.userId === ctx.session.user.id
        ),
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
          likes: true,
          _count: true,
        },
      });

      return posts.map((post) => {
        const { _count, likes, ...postData } = post;
        return {
          ...postData,
          likesCount: _count.likes,
          commentsCount: _count.comments,
          likedByMe: likes.some(
            (postLike) => postLike.userId === ctx.session.user.id
          ),
        };
      });
    },
  })
  // .query("getAllByUserId", {
  //   input: z.object({
  //     userId: string(),
  //   }),
  //   async resolve({ ctx, input }) {
  //     const posts = await prisma.post.findMany({
  //       where: {
  //         userId: input.userId,
  //       },
  //       include: {
  //         user: true,
  //         images: true,
  //         likes: true,
  //         _count: true,
  //       },
  //     });

  //     return posts.map((post) => {
  //       const { _count, likes, ...postData } = post;
  //       return {
  //         ...postData,
  //         likesCount: _count.likes,
  //         commentsCount: _count.comments,
  //         likedByMe: likes.some(
  //           (postLike) => postLike.userId === ctx.session.user.id
  //         ),
  //       };
  //     });
  //   },
  // })
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
    }),
    async resolve({ input, ctx }) {
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

      return await prisma.post.findFirst({
        where: {
          id: post.id,
        },
        include: {
          images: true,
          user: true,
        },
      });
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

// .mutation("likeComment", {
//   input: z.object({
//     commentId: z.string(),
//   }),
//   async resolve({ input, ctx }) {
//     const data = {
//       userId: ctx.session.user.id,
//       commentId: input.commentId,
//     };
//     const like = await prisma.commentLike.findFirst({ where: data });

//     if (like) {
//       await prisma.commentLike.delete({
//         where: {
//           userId_commentId: data,
//         },
//       });
//     } else {
//       await prisma.commentLike.create({
//         data,
//       });
//     }
//     const updatedComment = await prisma.comment.findFirstOrThrow({where: {
//       id: input.commentId,
//     }, include: {
//       user: true
//     }})

//     return ({
//       ...updatedComment,
//       likedByMe: like !== null,
//       likeCount: await prisma.commentLike.count(),
//     });
//   },
// });
