// import { Prisma, Tag, User, Comment } from "@prisma/client";

// const postWithUserAndImages = Prisma.validator<Prisma.PostArgs>()({
//   include: { images: true, user: true, shareParent: true },
// });

// type PostWithUserAndImages = Prisma.PostGetPayload<
//   typeof postWithUserAndImages
// >;

import { inferQueryOutput } from "src/utils/trpc";

export type PostDetailsType = inferQueryOutput<"post.getById">;

// export interface PostDetailsType extends PostWithUserAndImages {
//   tags: Tag[];
//   likedByMe: boolean;
//   commentsCount: number;
//   likesCount: number;
//   sharesCount: number;
//   bookmarkedByMe: boolean;
// }

export type CommentDetailsType = inferQueryOutput<"comment.getAllByPostId">[0];
export type SharedPostType = NonNullable<PostDetailsType["shareParent"]>;

export type CommunityDetailsType = inferQueryOutput<"community.getById">;

export type SearchEntryType = inferQueryOutput<"user.getBySearchPhrase">[0];

// export interface CommentDetailsType extends Comment {
//   likedByMe: boolean;
//   likeCount: number;
//   repliesCount: number;
//   user: User;
// }
