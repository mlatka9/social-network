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

export const useUserQuery = (userId: string) => {
  return trpc.useQuery([
    "user.getById",
    {
      userId,
    },
  ]);
};

export const useCurrentUserQuery = () => {
  const { data } = useSession();
  const currentUserId = data?.user?.id;
  return trpc.useQuery(
    [
      "user.getById",
      {
        userId: currentUserId || "",
      },
    ],
    {
      enabled: !!currentUserId,
    }
  );
};

export const usePost = (postId: string) => {
  return trpc.useQuery([
    "post.getById",
    {
      postId,
    },
  ]);
};

export const usePostComments = (postId: string) => {
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
  });
};
