import Link from "next/link";
import Image from "next/image";
import { useCommunityDetailsQuery, useUserQuery } from "src/hooks/query";
import { useRouter } from "next/router";
import { router } from "@trpc/server";
import ModalWrapper from "../common/modal-wrapper";
import MemebrsList from "./memebrs-list";
import ButtonFollow from "../common/button-follow";
import JoinCommunityButton from "./join-community-button";
import CommunitySettingsButton from "./community-settings-button";
import CommunitySettings from "./community-settings";

const CommunityProfileHero = () => {
  const { query, asPath, push } = useRouter();

  const communityId = query.params?.[0] as string;
  const section = query.params?.[1] as string;

  const { data: community, isError } = useCommunityDetailsQuery(communityId);

  const closeModal = () => {
    push(`/community/${communityId}`, undefined, { shallow: true });
  };

  if (isError) return <div>Cant find community</div>;
  if (!community) return <div>Loading...</div>;

  return (
    <>
      <div className="w-full h-80 relative">
        <Image
          alt=""
          layout="fill"
          objectFit="cover"
          src={community.bannerImage || "/images/fallback.svg"}
        />
      </div>

      <div className="flex p-6 min-h-[160px] rounded-xl bg-primary-0 dark:bg-primary-dark-100 mb-10 relative -mt-10">
        <div className="relative -mt-20 p-1 bg-primary-0 dark:bg-primary-dark-100 rounded-lg shrink-0">
          <Image
            src={community.image || "/images/fallback.svg"}
            width="150"
            height="150"
            className="rounded-lg"
            alt=""
            objectFit="cover"
          />
        </div>

        <div className="ml-6 w-full">
          <div className="flex items-baseline ">
            <h1 className="font-poppins font-semibold text-2xl">
              {community.name}
            </h1>
            <div className="text-xs  text-neutral-500 tracking-wide font-medium flex ml-7 space-x-4 ">
              <Link href={`${asPath}/members`} shallow={true}>
                <a>
                  <p className="cursor-pointer dark:text-primary-dark-700">
                    <span className="text-neutral-800 dark:text-primary-dark-700 font-semibold mr-1 font-poppins">
                      {community.memebrsCount}
                    </span>
                    Members
                  </p>
                </a>
              </Link>
            </div>
            {community.isAdmin ? (
              <CommunitySettingsButton />
            ) : (
              <JoinCommunityButton
                communityId={community.id}
                joinedByMe={community.joinedByMe}
              />
            )}
          </div>
          <p className="font-medium text-neutral-600 dark:text-primary-dark-700 mt-6 max-w-sm">
            {community.description}
          </p>
        </div>
      </div>
      {section === "members" && (
        <ModalWrapper title="Members" handleCloseModal={closeModal}>
          <MemebrsList />
        </ModalWrapper>
      )}
      {section === "settings" && (
        <ModalWrapper title="Settings" handleCloseModal={closeModal}>
          <CommunitySettings communityDetails={community} />
        </ModalWrapper>
      )}
    </>
  );
};

export default CommunityProfileHero;
