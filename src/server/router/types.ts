import { Prisma } from "@prisma/client";

const postWithUserAndImages = Prisma.validator<Prisma.PostArgs>()({
  include: {
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
  },
});

type PostWithUserAndImages = Prisma.PostGetPayload<
  typeof postWithUserAndImages
>;

export type PostCardProps = PostWithUserAndImages;
