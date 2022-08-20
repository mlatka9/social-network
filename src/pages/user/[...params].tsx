import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "src/utils/trpc";
import Image from "next/image";
import FollowersList from "@/components/followers-list";
import ButtonFollow from "@/components/button-follow";
import { FollowsListType } from "@/components/followers-list";
import ProfileSettings from "@/components/profile-settings";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "src/pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import type { GetServerSidePropsContext } from "next";
import PostList from "@/components/post-list";
import ModalWrapper from "@/components/modal-wrapper";
import { router } from "@trpc/server";
import Link from "next/link";

const User = () => {
  const { data: session } = useSession();
  const { query, asPath, push } = useRouter();

  const userId = query.params?.[0];
  const section = query.params?.[1];

  const currentUser = session?.user;

  const user = trpc.useQuery(["user.getById", { userId: userId || "" }], {
    enabled: !!userId,
    retry: false,
  });

  const closeModal = () => {
    push(`/user/${userId}`);
  };

  if (!userId) return <div>no user id</div>;

  if (user.error) return <div>Cant find user</div>;

  if (user.status === "loading") return <div>Loading</div>;

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
                <Link href={`${asPath}/following`}>
                  <a>
                    <p className="cursor-pointer">
                      <span className="text-neutral-800 font-semibold mr-1 font-poppins">
                        {user.data?.followingCount}
                      </span>
                      Following
                    </p>
                  </a>
                </Link>
                <Link href={`${asPath}/followers`}>
                  <a>
                    <p onClick={() => {}} className="cursor-pointer">
                      <span className="text-neutral-800 font-semibold mr-1 font-poppins">
                        {user.data?.followedByCount}
                      </span>
                      Followers
                    </p>
                  </a>
                </Link>
              </div>
            </div>

            <p className="font-medium text-neutral-600 mt-6">
              {user.data?.bio || "no bio"}
            </p>
          </div>
          {userId === currentUser?.id ? (
            <Link href={`${asPath}/settings`}>
              <a className="ml-auto">
                <div
                  onClick={() => {}}
                  className="bg-slate-800 text-white self-start py-2 px-4 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors"
                >
                  Settings
                </div>
              </a>
            </Link>
          ) : (
            <ButtonFollow userId={userId} />
          )}
        </div>
        <PostList userId={userId} />
      </div>

      {(section === "followers" || section === "following") && (
        <ModalWrapper title="Followers" handleCloseModal={closeModal}>
          <FollowersList userId={userId} />
        </ModalWrapper>
      )}
      {section === "settings" && (
        <ModalWrapper title="Settings" handleCloseModal={closeModal}>
          <ProfileSettings />
        </ModalWrapper>
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
