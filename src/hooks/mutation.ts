import { trpc } from "../utils/trpc";
import type { LocalTagType } from "@/components/post-input";

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

export const useAddPostMutation = () => {
  const utils = trpc.useContext();
  const mutation = trpc.useMutation("post.addPost", {
    onSuccess() {
      utils.invalidateQueries("post.getAll");
    },
  });

  return (postContent: string, imageUrls: string[], tags: LocalTagType[]) =>
    mutation.mutate({
      tags: tags,
      content: postContent,
      images: imageUrls.length
        ? imageUrls.map((url) => ({ imageAlt: "alt", imageUrl: url }))
        : null,
    });
};
