/* eslint-disable @typescript-eslint/naming-convention */
import { Prisma } from '@prisma/client';
import { prisma } from '../db/client';

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
  sharedBy: {
    select: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
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

export const communityListInclude = {
  _count: true,
  category: true,
  members: {
    select: {
      userId: true,
      role: true,
    },
  },
  favouriteBy: {
    select: {
      userId: true,
    },
  },
};

export const getUsersListInclude = (myFollowingIds: string[]) => ({
  followedBy: {
    where: {
      id: {
        in: myFollowingIds,
      },
    },
    select: {
      id: true,
      name: true,
    },
  },
  _count: {
    select: {
      followedBy: true,
    },
  },
});

const postWithUserAndImages = Prisma.validator<Prisma.PostArgs>()({
  include: postDetailsInclude,
});

type PostWithUserAndImages = Prisma.PostGetPayload<
  typeof postWithUserAndImages
>;

export type PostCardProps = PostWithUserAndImages;

const communitiesList = Prisma.validator<Prisma.CommunityArgs>()({
  include: communityListInclude,
});

type CommunitiesList = Prisma.CommunityGetPayload<typeof communitiesList>;

const usersList = Prisma.validator<Prisma.UserArgs>()({
  include: getUsersListInclude([]),
});

type UsersListType = Prisma.UserGetPayload<typeof usersList>;

export const populateUsersList = (
  users: UsersListType[],
  myFollowingIds: string[]
) =>
  users.map(
    ({
      _count,
      bannerImage,
      emailVerified,
      followedBy,
      id,
      ...suggestedUserData
    }) => ({
      ...suggestedUserData,
      id,
      mutualUsers: followedBy,
      followersCount: _count.followedBy,
      followedByMe: myFollowingIds.some((follow) => follow === id),
    })
  );

export const populateCommunitiesList = (
  communities: CommunitiesList[],
  userId: string
) =>
  communities.map(({ _count, members, favouriteBy, ...communityData }) => ({
    ...communityData,
    membersCount: _count.members,
    joinedByMe: members.some((member) => member.userId === userId),
    isMyfavourite: favouriteBy.some((user) => user.userId === userId),
    isOwner:
      members.find((member) => member.role === 'ADMIN')?.userId === userId,
  }));

export const populatePost = (
  post: PostCardProps,
  userId: string,
  myFollowingIds: string[]
) => {
  const {
    _count,
    likes,
    bookmarkedBy,
    tags,
    community,
    comments,
    mentions,
    sharedBy,
    user: { bio, email, emailVerified, ...userData },
    ...postData
  } = post;

  return {
    ...postData,
    user: {
      ...userData,
    },
    sharedBy: sharedBy
      .map((userShare) => userShare.user)
      .filter((user) => myFollowingIds.includes(user.id)),
    mentions: mentions.map((mention) => mention.user),
    communityName: community?.name || null,
    tags: post.tags.map((tag) => tag.tag),
    likesCount: _count.likes,
    commentsCount: comments.filter((comment) => !comment.isDeleted).length,
    sharesCount: _count.shares + sharedBy.length,
    sharedByMe: sharedBy.some((userShare) => userShare.user.id === userId),
    likedByMe: likes.some((postLike) => postLike.userId === userId),
    bookmarkedByMe: bookmarkedBy.some((bookmark) => bookmark.userId === userId),
  };
};

// export const swapRepostWithOriginal = async (post: PostCardProps) => {
//   if (post.isQuoteShare !== false) return { ...post, rePostedBy: null };

//   const parentPost = await prisma.post.findUnique({
//     where: {
//       id: post.shareParentId!,
//     },
//     include: postDetailsInclude,
//   });

//   return parentPost
//     ? { ...parentPost, rePostedBy: null }
//     : { ...post, rePostedBy: post.user };
// };

export const getMyFollowingIds = async (userId: string) => {
  const myFollowing = await prisma.user.findMany({
    where: {
      followedBy: {
        some: {
          id: userId,
        },
      },
    },
  });

  return myFollowing.map((user) => user.id);
};

export const getDateXDaysAgo = (numOfDays: number, date = new Date()) => {
  const daysAgo = new Date(date.getTime());
  daysAgo.setDate(date.getDate() - numOfDays);

  return daysAgo;
};
