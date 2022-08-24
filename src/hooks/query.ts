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

export const useCurrentUserQuery = () => {
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

export const useSearchUserQuery = (searchPhrase: string) => {
  return trpc.useQuery(["user.getBySearchPhrase", { searchPhrase }], {
    keepPreviousData: true,
    // enabled: !!searchPhrase,
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
