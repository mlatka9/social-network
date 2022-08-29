import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import { prisma } from "../db/client";

// Example router with queries that can only be hit if the user requesting is signed in
export const communityRouter = createProtectedRouter()
  .query("getAll", {
    async resolve({ input }) {
      return await prisma.community.findMany({});
    },
  })
  .mutation("addCommunity", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await prisma.community.create({
        data: {
          name: input.name,
          members: {
            create: {
              role: "ADMIN",
              userId: ctx.session.user.id,
            },
          },
        },
      });
    },
  });
