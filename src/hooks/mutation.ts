import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

interface UseUserProfileMutationType {
  name: string;
  bio: string;
  image?: string;
  bannerImage?: string;
}

export const useProfileMutation = () => {
  const utils = trpc.useContext();
  const mutation = trpc.useMutation(["user.update"], {
    onSuccess() {
      utils.invalidateQueries(["post.getInfiniteFeed"]);
      utils.invalidateQueries(["post.getAll"]);
      utils.invalidateQueries(["post.getById"]);
      utils.invalidateQueries(["bookmarks.getAll"]);
    },
  });

  return mutation.mutate;
};

import { inferMutationInput } from "src/utils/trpc";

export const useAddCommentMutation = (postId: string) => {
  const utils = trpc.useContext();
  const mutation = trpc.useMutation(["comment.add"], {
    onSuccess() {
      utils.invalidateQueries(["comment.getAllByPostId", { postId }]);
    },
  });

  return (args: Omit<inferMutationInput<"comment.add">, "postId">) => {
    mutation.mutate({ postId, ...args });
  };
};
