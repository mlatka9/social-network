import { PostCardProps } from "./types";

export const populatePost = (post: PostCardProps, userId: string) => {
  const {
    _count,
    likes,
    bookmarkedBy,
    tags,
    community,
    comments,
    user: { bio, email, emailVerified, ...userData },
    ...postData
  } = post;

  return {
    ...postData,
    user: {
      ...userData,
    },
    communityName: community?.name || null,
    tags: post.tags.map((tag) => tag.tag),
    likesCount: _count.likes,
    commentsCount: comments.filter((comment) => !comment.isDeleted).length,
    sharesCount: _count.shares,
    likedByMe: likes.some((postLike) => postLike.userId === userId),
    bookmarkedByMe: bookmarkedBy.some((bookmark) => bookmark.userId === userId),
  };
};
