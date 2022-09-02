import { useSession } from 'next-auth/react';
import { trpc } from '../utils/trpc';

export const useInfiniteFeedQuery = ({
  sort,
  time,
}: {
  sort?: string;
  time?: string;
} = {}) =>
  trpc.useInfiniteQuery(
    [
      'post.getInfiniteFeed',
      {
        limit: 5,
        sort: sort === 'top' ? sort : undefined,
        time:
          time === 'day' || time === 'week'
            ? (time as 'day' | 'week')
            : undefined,
      },
    ],
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

export const useUserPostsQuery = (useId: string) =>
  trpc.useInfiniteQuery(
    [
      'post.getAll',
      {
        limit: 5,
        userId: useId,
      },
    ],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

export const useUserBookmarkedPostsQuery = () =>
  trpc.useInfiniteQuery(
    [
      'bookmarks.getAll',
      {
        limit: 5,
      },
    ],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

export const usePostsWithTagQuery = (tag: string) =>
  trpc.useInfiniteQuery(
    [
      'post.getAll',
      {
        limit: 5,
        tagName: tag,
      },
    ],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

export const useUserQuery = (userId: string) =>
  trpc.useQuery(
    [
      'user.getById',
      {
        userId,
      },
    ],
    {
      retry: false,
    }
  );

export const useCurrentUserProfileQuery = () => {
  const { data } = useSession();
  const currentUserId = data?.user?.id;

  return trpc.useQuery(
    [
      'user.getById',
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

export const usePostQuery = (postId?: string) =>
  trpc.useQuery(
    [
      'post.getById',
      {
        postId: postId!,
      },
    ],
    {
      enabled: !!postId,
      retry: false,
    }
  );

export const usePostCommentsQuery = (postId: string) =>
  trpc.useQuery([
    'comment.getAllByPostId',
    {
      postId,
    },
  ]);

export const useSearchQuery = (searchPhrase: string) =>
  trpc.useQuery(['search.getBySearchPhrase', { searchPhrase }], {
    keepPreviousData: true,
    enabled: !!searchPhrase,
  });

export const useSearchTagQuery = (searchPhrase: string) =>
  trpc.useQuery(['tags.getBySearchPhrase', { searchPhrase }], {
    keepPreviousData: true,
  });

export const useTrendingTagsQuery = () => trpc.useQuery(['tags.trending']);

export const useFollowingQuery = (userId: string) =>
  trpc.useQuery(['user.getFollowing', { userId }]);

export const useFollowersQuery = (userId: string) =>
  trpc.useQuery(['user.getFollowers', { userId }]);

export const useCommunitiesQuery = (category?: string, filter?: string) =>
  trpc.useQuery(['community.getAll', { categoryId: category, filter }]);

export const useCommunityPostsQuery = ({
  communityId,
  sort,
  time,
}: {
  communityId: string;
  sort?: string;
  time?: string;
  enabled?: boolean;
}) =>
  trpc.useInfiniteQuery(
    [
      'post.getAll',
      {
        limit: 5,
        communityId,
        sort: sort === 'top' ? sort : undefined,
        time:
          time === 'day' || time === 'week'
            ? (time as 'day' | 'week')
            : undefined,
      },
    ],
    {
      keepPreviousData: true,
      retry: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

export const useCommunityDetailsQuery = (communityId: string) =>
  trpc.useQuery(['community.getById', { id: communityId }]);

export const useCommunityMembersQuery = (communityId: string) =>
  trpc.useQuery(['community.getMembers', { communityId }]);

export const usePopularCommunitiesQuery = () =>
  trpc.useQuery(['community.popular']);

export const useSearchUsersQuery = (searchPhrase: string) =>
  trpc.useQuery(['user.getBySearchPhrase', { searchPhrase }], {
    keepPreviousData: true,
    // enabled: !!searchPhrase,
  });

export const useCategoryQuery = () =>
  trpc.useQuery(['community.getAllCategories']);

export const useSuggestedUsersQuery = () =>
  trpc.useQuery(['explore.getSuggestedUsers']);
