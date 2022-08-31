import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

export const useInfiniteFeedQuery = () => {
  return trpc.useInfiniteQuery(
    [
      "post.getInfiniteFeed",
      {
        limit: 5,
      },
    ],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
};

export const useUserPostsQuery = (useId: string) => {
  return trpc.useInfiniteQuery(
    [
      "post.getAll",
      {
        limit: 5,
        userId: useId,
      },
    ],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
};

export const useUserBookmarkedPostsQuery = () => {
  return trpc.useInfiniteQuery(
    [
      "bookmarks.getAll",
      {
        limit: 5,
      },
    ],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
};

export const usePostsWithTagQuery = (tag: string) => {
  const res = trpc.useInfiniteQuery(
    [
      "post.getAll",
      {
        limit: 5,
        tagName: tag,
      },
    ],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return res;
};

export const useUserQuery = (userId: string) => {
  return trpc.useQuery(
    [
      "user.getById",
      {
        userId,
      },
    ],
    {
      retry: false,
    }
  );
};

export const useCurrentUserProfileQuery = () => {
  const { data } = useSession();
  const currentUserId = data?.user?.id;

  return trpc.useQuery(
    [
      "user.getById",
      {
        userId: currentUserId!,
      },
    ],
    {
      enabled: !!currentUserId,
      staleTime: Infinity,
    }
  );
};

export const usePostQuery = (postId?: string) => {
  return trpc.useQuery(
    [
      "post.getById",
      {
        postId: postId!,
      },
    ],
    {
      enabled: !!postId,
      retry: false,
    }
  );
};

export const usePostCommentsQuery = (postId: string) => {
  return trpc.useQuery([
    "comment.getAllByPostId",
    {
      postId,
    },
  ]);
};

export const useSearchQuery = (searchPhrase: string) => {
  return trpc.useQuery(["search.getBySearchPhrase", { searchPhrase }], {
    keepPreviousData: true,
    enabled: !!searchPhrase,
  });
};

export const useSearchTagQuery = (searchPhrase: string) => {
  return trpc.useQuery(["tags.getBySearchPhrase", { searchPhrase }], {
    keepPreviousData: true,
  });
};

export const useTrendingTagsQuery = () => {
  return trpc.useQuery(["tags.trending"]);
};

export const useFollowsQuery = (userId: string) => {
  return trpc.useQuery(["user.getFollows", { userId }]);
};

export const useCommunitiesQuery = (category?: string) => {
  return trpc.useQuery(["community.getAll", { categoryId: category }]);
};

export const useCommunityPostsQuery = (communityId: string) => {
  return trpc.useInfiniteQuery(
    [
      "post.getAll",
      {
        limit: 5,
        communityId: communityId,
      },
    ],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
};

export const useCommunityDetailsQuery = (communityId: string) => {
  return trpc.useQuery(["community.getById", { id: communityId }]);
};

export const useCommunityMembersQuery = (communityId: string) => {
  return trpc.useQuery(["community.getMembers", { communityId: communityId }]);
};

export const usePopularCommunitiesQuery = () => {
  return trpc.useQuery(["community.popular"]);
};

export const useSearchUsersQuery = (searchPhrase: string) => {
  return trpc.useQuery(["user.getBySearchPhrase", { searchPhrase }], {
    keepPreviousData: true,
    // enabled: !!searchPhrase,
  });
};

export const useCategoryQuery = () => {
  return trpc.useQuery(["community.getAllCategories"]);
};
