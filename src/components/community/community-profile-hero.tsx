/* eslint-disable @typescript-eslint/no-shadow */
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CommunityDetailsType } from '@/types/db';
import ModalWrapper from '@/components/common/modal-wrapper';
import Members from './members-list';
import JoinCommunityButton from './join-community-button';
import CommunitySettingsButton from './community-settings-button';
import CommunitySettings from './community-settings';
import CommunityFavouriteIcon from './community-favourite-icon';
import Loading from '../common/loading';

interface CommunityProfileHeroProps {
  community: CommunityDetailsType | undefined;
}

const CommunityProfileHero = ({ community }: CommunityProfileHeroProps) => {
  const router = useRouter();
  const basePath = router.asPath.split('?')[0]!;
  const { section } = router.query;

  const closeModal = () => {
    const { section, communityId, ...restParams } = router.query;
    router.replace(
      {
        pathname: `/community/${communityId}`,
        query: { ...restParams },
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  };

  const getMembersHref = () => {
    const { communityId, ...restParams } = router.query;
    return {
      pathname: basePath,
      query: { ...restParams, section: 'members' },
    };
  };

  if (!community) {
    return (
      <div className="mb-10 dark:bg-primary-dark-200 bg-primary-0">
        <Loading height={440} />
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-60 md:h-80 relative">
        <Image
          alt=""
          layout="fill"
          objectFit="cover"
          src={community?.bannerImage || '/images/fallback.svg'}
        />
      </div>

      <div className="flex p-6 min-h-[160px] rounded-xl bg-primary-0 dark:bg-primary-dark-200 mb-10 relative -mt-10 flex-col md:flex-row items-center md:items-start">
        <div className="relative -mt-20 p-1 bg-primary-0 dark:bg-primary-dark-200 rounded-lg shrink-0 w-fit">
          <Image
            src={community.image || '/images/community-fallback.svg'}
            width="150"
            height="150"
            className="rounded-lg"
            alt=""
            objectFit="cover"
          />
        </div>

        <div className="md:ml-4 w-full overflow-hidden">
          <div className="grid md:grid-cols-[auto_1fr] w-full">
            <div className="flex flex-col items-center md:items-start overflow-hidden mr-5">
              <Link href={`/community?category=${community.categoryId}`}>
                <a className="hover:underline text-center md:text-left">
                  {community.category.name}
                </a>
              </Link>
              <h1 className="font-poppins font-semibold text-2xl">
                {community.name}
              </h1>
              <div className="text-xs  text-neutral-500 tracking-wide font-medium flex space-x-4   mt-3 md:mt-[6px] mb-5 md:mb-0">
                <Link href={getMembersHref()} shallow>
                  <a className="hover:underline">
                    <p className="cursor-pointer dark:text-primary-dark-700">
                      <span className="text-neutral-800 dark:text-primary-dark-700 font-semibold mr-1 font-poppins">
                        {community.membersCount}
                      </span>
                      Members
                    </p>
                  </a>
                </Link>
              </div>
            </div>

            <div className="flex mx-auto md:mx-0 md:ml-auto items-center mb-auto space-x-2">
              <CommunityFavouriteIcon
                communityId={community.id}
                isMyfavourite={community.isMyfavourite}
              />
              {community.isOwner ? (
                <CommunitySettingsButton />
              ) : (
                <JoinCommunityButton
                  communityName={community.name}
                  communityId={community.id}
                  joinedByMe={community.joinedByMe}
                />
              )}
            </div>
          </div>

          <p className="text-center md:text-left font-medium text-neutral-600 dark:text-primary-dark-700 mt-6">
            {community.description}
          </p>
        </div>
      </div>
      {section === 'members' && (
        <ModalWrapper title="Members" handleCloseModal={closeModal}>
          <Members />
        </ModalWrapper>
      )}
      {section === 'settings' && (
        <ModalWrapper title="Settings" handleCloseModal={closeModal}>
          <CommunitySettings
            communityDetails={community}
            handleCloseModal={closeModal}
          />
        </ModalWrapper>
      )}
    </>
  );
};

export default CommunityProfileHero;
