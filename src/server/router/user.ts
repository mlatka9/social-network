import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import { resolve } from "path";
import { prisma } from "../db/client";

// Example router with queries that can only be hit if the user requesting is signed in
export const userRouter = createProtectedRouter()
  .query("getById", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.user.findFirstOrThrow({
        where: {
          id: input.userId,
        },
      });
    },
  })
  .query("me", {
    async resolve({ ctx }) {
      return ctx.session.user;
    },
  });
