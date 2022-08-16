import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import PostCard from "../../components/post-card";
import FollowersList from "@/components/followers-list";
import ButtonFollow from "@/components/button-follow";
import { FollowsListType } from "@/components/followers-list";
import ProfileSettings from "@/components/profile-settings";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "src/pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import type { GetServerSidePropsContext, NextPage } from "next";
import PostList from "@/components/post-list";

const User = () => {
  const utils = trpc.useContext();
  const { data: session } = useSession();
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

  const currentUser = session?.user;

  const userId = query.userId?.[0] || "";

  const user = trpc.useQuery(["user.getById", { userId }], {
    enabled: !!userId,
    retry: false,
  });

  if (!user.data) return <div>Loading</div>;

  return (
    <div>
      <div className="w-full h-80 relative">
        <Image
          alt=""
          layout="fill"
          objectFit="cover"
          src={user.data?.bannerImage || "/images/fallback.svg"}
        />
      </div>

      <div className="container mx-auto ">
        <div className="flex p-6 min-h-[160px] rounded-xl bg-white mb-10 relative -mt-10">
          <div className="relative -mt-20 p-1 bg-white rounded-lg">
            <Image
              src={user.data?.image || "/images/fallback.svg"}
              width="150"
              height="150"
              className="rounded-lg"
              alt=""
              objectFit="cover"
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
          {userId === currentUser?.id ? (
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
        <PostList userId={userId} />
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}

export default User;
