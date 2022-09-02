/* eslint-disable @typescript-eslint/naming-convention */
import { Prisma } from '@prisma/client';

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
  mentions: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
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

const postWithUserAndImages = Prisma.validator<Prisma.PostArgs>()({
  include: postDetailsInclude,
});

type PostWithUserAndImages = Prisma.PostGetPayload<
  typeof postWithUserAndImages
>;

export type PostCardProps = PostWithUserAndImages;

export const populatePost = (post: PostCardProps, userId: string) => {
  const {
    _count,
    likes,
    bookmarkedBy,
    tags,
    community,
    comments,
    mentions,
    user: { bio, email, emailVerified, ...userData },
    ...postData
  } = post;

  return {
    ...postData,
    user: {
      ...userData,
    },
    mentions: mentions.map((mention) => mention.user),
    communityName: community?.name || null,
    tags: post.tags.map((tag) => tag.tag),
    likesCount: _count.likes,
    commentsCount: comments.filter((comment) => !comment.isDeleted).length,
    sharesCount: _count.shares,
    likedByMe: likes.some((postLike) => postLike.userId === userId),
    bookmarkedByMe: bookmarkedBy.some((bookmark) => bookmark.userId === userId),
  };
};

export const getDateXDaysAgo = (numOfDays: number, date = new Date()) => {
  const daysAgo = new Date(date.getTime());
  daysAgo.setDate(date.getDate() - numOfDays);

  return daysAgo;
};
