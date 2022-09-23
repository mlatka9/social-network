/* eslint-disable arrow-body-style */
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
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
        sort: sort === 'top' ? sort : undefined,
        time:
          time === 'day' || time === 'week'
            ? (time as 'day' | 'week')
            : undefined,
      },
    ],
    {
      // keepPreviousData: true,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

export const useUserPostsQuery = (userId: string, filter?: string) =>
  trpc.useInfiniteQuery(
    [
      'post.getAll',
      {
        limit: 5,
        userId: filter === 'likes' ? undefined : userId,
        withImage: filter === 'images',
        likedByUsedId: filter === 'likes' ? userId : undefined,
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

export const usePostQuery = (postId?: string) => {
  const utils = trpc.useContext();
  const router = useRouter();

  const sort = router.query.sort as string | undefined;
  const time = router.query.time as string | undefined;

  return trpc.useQuery(
    [
      'post.getById',
      {
        postId: postId!,
      },
    ],
    {
      enabled: !!postId,
      retry: false,

      initialData: () => {
        let initialPost;

        utils
          .getInfiniteQueryData([
            'post.getInfiniteFeed',
            {
              sort: sort === 'top' ? sort : undefined,
              time:
                time === 'day' || time === 'week'
                  ? (time as 'day' | 'week')
                  : undefined,
            },
          ])
          ?.pages.forEach((page) =>
            page.posts.forEach((post) => {
              if (post.id === postId) {
                initialPost = post;
              }
            })
          );

        return initialPost;
      },
    }
  );
};

export const usePostCommentsQuery = (postId: string) => {
  return trpc.useQuery([
    'comment.getAllByPostId',
    {
      postId,
    },
  ]);
};

export const useSearchQuery = (searchPhrase: string) =>
  trpc.useQuery(['search.getBySearchPhrase', { searchPhrase }], {
    keepPreviousData: true,
    // enabled: !!searchPhrase,
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
  trpc.useInfiniteQuery(
    ['community.getAll', { categoryId: category, filter }],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      keepPreviousData: true,
    }
  );

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
  trpc.useQuery(['community.getById', { id: communityId }], {
    retry: false,
  });

export const useCommunityMembersQuery = (communityId: string) =>
  trpc.useQuery(['community.getMembers', { communityId }]);

export const usePopularCommunitiesQuery = () =>
  trpc.useQuery(['community.popular']);

export const useSearchUsersQuery = (searchPhrase: string) => {
  return trpc.useQuery(['user.getBySearchPhrase', { searchPhrase }], {
    keepPreviousData: true,
    // enabled: !!searchPhrase,
  });
};

export const useCategoryQuery = () =>
  trpc.useQuery(['community.getAllCategories']);

export const useSuggestedUsersQuery = (limit?: number) =>
  trpc.useQuery(['explore.getSuggestedUsers', { limit }]);

export const useSuggestedCommunitiesQuery = (limit?: number) => {
  return trpc.useQuery(['explore.getSuggestedCommunities', { limit }]);
};

export const useNotificationsQuery = (unread?: boolean) => {
  const utils = trpc.useContext();
  return trpc.useQuery(['notification.getAll', {unread}], {
    
    initialData: () => {
  
      if(unread) {
        const allNotifications = utils.getQueryData(['notification.getAll', {unread: false}])
        if(!allNotifications) return undefined;
        
        return ({
          notificationsMentions: allNotifications?.notificationsMentions.filter(n=>!n.isRead) || [],
          notificationsStartFollow: allNotifications?.notificationsStartFollow.filter(n=>!n.isRead) || [],
          notificationsCommunityNewMember: allNotifications?.notificationsCommunityNewMember.filter(n=>!n.isRead) || [],
          notificationsPostComment: allNotifications?.notificationsPostComment.filter(n=>!n.isRead) || [],
          notificationsCommentReply: allNotifications?.notificationsCommentReply.filter(n=>!n.isRead) || [],
        })
      }

      return undefined;
    }
  });
};

export const useNotificationsCountQuery = () => {
  return trpc.useQuery(['notification.count']);
};
