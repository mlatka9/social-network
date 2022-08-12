import { useRouter } from "next/router";
import { useEffect } from "react";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import PostCard from "../../components/post-card";

const User = () => {
  const { query, isReady, push } = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!query.userId) {
      push("/");
    }
  }, [isReady]);

  const userId = ((query.userId as string[]) || [])[0] || "";

  const user = trpc.useQuery(["user.getById", { userId: userId }], {
    enabled: !!userId,
    retry: false,
  });

  const utils = trpc.useContext();

  const mutationToggleLike = trpc.useMutation("post.toggleLike", {
    onSuccess(input) {
      utils.invalidateQueries(["post.getAll", { userId: userId }]);
      //   if (!posts) return;
      //   utils.setQueryData(["post.getAll"], (posts) => {
      //     if (!posts) return [];
      //     return posts.map((post) =>
      //       post.id === input.updatedPost?.id
      //         ? { ...post, ...input.updatedPost }
      //         : post
      //     );
      //   });
    },
  });

  const handleToggleLike = async (postId: string) => {
    mutationToggleLike.mutate({ postId: postId });
  };

  const userPosts = trpc.useQuery(["post.getAll", { userId: userId }], {
    enabled: !!userId,
    retry: false,
  });

  return (
    <div>
      <div className="w-full h-80 relative">
        <Image layout="fill" src="/images/default-banner.jpg" />
      </div>

      <div className="container mx-auto ">
        <div className="flex p-6 min-h-[160px] rounded-xl bg-white mb-10 relative -mt-10">
          <div className="relative -mt-20 p-1 bg-white rounded-lg">
            <Image
              src={user.data?.image || ""}
              width="150"
              height="150"
              className="rounded-lg"
              alt=""
            />
          </div>

          <div className="ml-6">
            <h1 className="font-poppins font-semibold text-2xl">
              {user.data?.name}
            </h1>
            <p className="font-medium text-neutral-600 mt-6">
              Photographer & Filmmaker based in Copenhagen, Denmark ✵ 🇩🇰
            </p>
          </div>

          <button className="bg-blue-500 rounded px-6 py-2 ml-auto self-start text-white">
            Follow
          </button>
        </div>

        <div className="space-y-5 mb-10">
          {userPosts.isSuccess &&
            userPosts.data.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                handleToggleLike={handleToggleLike}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default User;
