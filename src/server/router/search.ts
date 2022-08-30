import { z } from "zod";
import { createProtectedRouter } from "./protected-router";
import { prisma } from "../db/client";
import { SearchType } from "./types";

export const searchRouter = createProtectedRouter().query("getBySearchPhrase", {
  input: z.object({
    searchPhrase: z.string(),
  }),

  async resolve({ input }) {
    const matchingUsers = await prisma.user.findMany({
      where: {
        name: {
          contains: input.searchPhrase,
        },
      },
      include: {
        _count: {
          select: {
            followedBy: true,
          },
        },
      },
      take: 5,
    });

    const matchingCommunities = await prisma.community.findMany({
      where: {
        name: {
          contains: input.searchPhrase,
        },
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
      take: 5,
    });

    const matchingUsersWithFollows = matchingUsers.map(
      ({ _count, id, name, image, ...userData }) => ({
        type: SearchType.USER,
        id,
        title: name,
        image: image,
        followersCount: _count.followedBy,
      })
    );

    const matchingCommunitiesWithFollows = matchingCommunities.map(
      ({ _count, id, name, image, ...comunityData }) => ({
        type: SearchType.COMMUNITY,
        id,
        title: name,
        image: image,
        followersCount: _count.members,
      })
    );

    return [...matchingUsersWithFollows, ...matchingCommunitiesWithFollows]
      .sort((a, b) => a.followersCount - b.followersCount)
      .slice(0, 5);
  },
});
