import { Prisma } from "@prisma/client";

export const postDetailsInclude = {
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
  shareParent: true,
};

const postWithUserAndImages = Prisma.validator<Prisma.PostArgs>()({
  include: postDetailsInclude,
});

type PostWithUserAndImages = Prisma.PostGetPayload<
  typeof postWithUserAndImages
>;

export type PostCardProps = PostWithUserAndImages;
