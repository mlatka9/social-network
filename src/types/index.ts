import { Prisma, Tag, User, Comment } from "@prisma/client";

const postWithUserAndImages = Prisma.validator<Prisma.PostArgs>()({
  include: { images: true, user: true, shareParent: true },
});

type PostWithUserAndImages = Prisma.PostGetPayload<
  typeof postWithUserAndImages
>;

export interface PostDetailsType extends PostWithUserAndImages {
  tags: Tag[];
  likedByMe: boolean;
  commentsCount: number;
  likesCount: number;
  sharesCount: number;
  bookmarkedByMe: boolean;
}

export interface CommentDetailsType extends Comment {
  likedByMe: boolean;
  likeCount: number;
  repliesCount: number;
  user: User;
}
