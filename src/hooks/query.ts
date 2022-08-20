import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import type { LocalTagType } from "@/components/post-input";

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
    enabled: !!searchPhrase,
  });
};

export const useSearchTagQuery = (searchPhrase: string) => {
  const data = trpc.useQuery(["tags.getBySearchPhrase", { searchPhrase }], {
    keepPreviousData: true,
  });
  const tags = data.data;
  if (!tags) {
    return data;
  }

  const foramttedTags = tags.map((tag) => ({
    ...tag,
    status: "created",
  })) as LocalTagType[];

  return { ...data, data: foramttedTags };
};
