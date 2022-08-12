import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import PostCard from "../../components/post-card";
import FollowersList from "@/components/followers-list";
import ButtonFollow from "@/components/button-follow";
import { FollowsListType } from "@/components/followers-list";
import ProfileSettings from "@/components/profile-settings";

const User = () => {
  const { query, isReady, push } = useRouter();
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedFollowType, setSelectedFollowType] =
    useState<FollowsListType>("following");

  const closeFollowersModal = () => {
    setIsFollowersModalOpen(false);
  };

  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  const handleOpenFollowersModal = (type: FollowsListType) => {
    setIsFollowersModalOpen(true);
    setSelectedFollowType(type);
  };

  const handleOpenSettingsModal = () => {
    setIsSettingsModalOpen(true);
  };

  useEffect(() => {
    if (!isReady) return;
    if (!query.userId) {
      push("/");
    }
  }, [isReady]);

  const userId = ((query.userId as string[]) || [])[0] || "";

  const me = trpc.useQuery(["user.me"]);

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
        <Image layout="fill" src={user.data?.bannerImage || ""} />
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
            <div className="flex items-baseline">
              <h1 className="font-poppins font-semibold text-2xl">
                {user.data?.name}
              </h1>
              <div className="text-xs  text-neutral-500 tracking-wide font-medium flex ml-7 space-x-4">
                <p
                  onClick={() => handleOpenFollowersModal("following")}
                  className="cursor-pointer"
                >
                  <span className="text-neutral-800 font-semibold mr-1 font-poppins">
                    {user.data?.followingCount}
                  </span>
                  Following
                </p>
                <p
                  onClick={() => handleOpenFollowersModal("followers")}
                  className="cursor-pointer"
                >
                  <span className="text-neutral-800 font-semibold mr-1 font-poppins">
                    {user.data?.followedByCount}
                  </span>
                  Followers
                </p>
              </div>
            </div>

            <p className="font-medium text-neutral-600 mt-6">
              {user.data?.bio || "no bio"}
            </p>
          </div>
          {userId === me.data?.id ? (
            <button
              onClick={handleOpenSettingsModal}
              className="bg-slate-800 ml-auto text-white self-start py-2 px-4 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors"
            >
              Settings
            </button>
          ) : (
            <ButtonFollow userId={userId} />
          )}
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
      {isFollowersModalOpen && (
        <FollowersList
          selectedFollowType={selectedFollowType}
          closeFollowersModal={closeFollowersModal}
          userId={userId}
        />
      )}
      {isSettingsModalOpen && (
        <ProfileSettings handleCloseSettigns={closeSettingsModal} />
      )}
    </div>
  );
};

export default User;
