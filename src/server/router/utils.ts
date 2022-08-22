import { PostCardProps } from "./types";

export const populatePost = (post: PostCardProps, userId: string) => {
  const { _count, likes, bookmarkedBy, tags, ...postData } = post;
  return {
    ...postData,
    tags: post.tags.map((tag) => tag.tag),
    likesCount: _count.likes,
    commentsCount: _count.comments,
    likedByMe: likes.some((postLike) => postLike.userId === userId),
    bookmarkedByMe: bookmarkedBy.some((bookmark) => bookmark.userId === userId),
  };
};
