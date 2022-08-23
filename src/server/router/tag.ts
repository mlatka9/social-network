import { createProtectedRouter } from "./protected-router";
import { prisma } from "../db/client";
import { z } from "zod";

// Example router with queries that can only be hit if the user requesting is signed in
export const tagRouter = createProtectedRouter()
  .query("getBySearchPhrase", {
    input: z.object({
      searchPhrase: z.string(),
    }),
    async resolve({ input }) {
      if (!input.searchPhrase) {
        return [];
      }
      return await prisma.tag.findMany({
        where: {
          name: {
            contains: input.searchPhrase,
            mode: "insensitive",
          },
        },
      });
    },
  })
  .query("trending", {
    async resolve() {
      const data = await prisma.postTag.groupBy({
        by: ["tagName"],
        _count: {
          postId: true,
        },
        orderBy: {
          _count: {
            postId: "desc",
          },
        },
        take: 5,
      });

      return data.map((tagData) => ({
        tagName: tagData.tagName,
        postsCount: tagData._count.postId,
      }));
    },
  });
