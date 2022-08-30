import { Prisma } from "@prisma/client";

export const postDetailsInclude = {
  images: true,
  tags: {
    include: {
      tag: true,
    },
  },
  comments: {
    select: {
      isDeleted: true,
    },
  },
  user: true,
  _count: true,
  likes: true,
  community: {
    select: {
      name: true,
    },
  },
  bookmarkedBy: true,
  shareParent: {
    include: {
      images: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  },
};

export enum SearchType {
  COMMUNITY,
  USER,
}

const postWithUserAndImages = Prisma.validator<Prisma.PostArgs>()({
  include: postDetailsInclude,
});

type PostWithUserAndImages = Prisma.PostGetPayload<
  typeof postWithUserAndImages
>;

export type PostCardProps = PostWithUserAndImages;
