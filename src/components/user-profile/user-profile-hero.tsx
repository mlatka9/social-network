import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { UserDetailsType } from '@/types/db';
import UserProfileButton from './user-profile-button';
import Loading from '../common/loading';

interface UserProfileHeroProps {
  userDetails: UserDetailsType | undefined;
}

const UserProfileHero = ({ userDetails }: UserProfileHeroProps) => {
  const router = useRouter();

  if (!userDetails) {
    return (
      <div className="mb-10 dark:bg-primary-dark-200 bg-primary-0">
        <Loading height={440} />
      </div>
    );
  }

  const basePath = router.asPath.split('?')[0]!;

  const getSectionHref = (sectionName: 'following' | 'followers') => {
    const { userId, ...restParams } = router.query;
    return {
      pathname: basePath,
      query: { ...restParams, section: sectionName },
    };
  };

  return (
    <>
      <div className="w-full h-60 md:h-80 relative">
        <Image
          alt=""
          layout="fill"
          objectFit="cover"
          src={userDetails?.bannerImage || '/images/fallback.svg'}
        />
      </div>

      <div className="flex p-6 min-h-[160px] rounded-xl bg-primary-0 dark:bg-primary-dark-200 mb-10 relative -mt-10 flex-col md:flex-row items-center md:items-start">
        <div className="relative -mt-20 p-1 bg-primary-0 dark:bg-primary-dark-200 rounded-lg shrink-0 w-fit">
          <Image
            src={userDetails?.image || '/images/avatar-fallback.svg'}
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
              <h1 className="font-poppins font-semibold text-2xl text-center md:text-left">
                {userDetails?.name}
              </h1>
              <div className="text-xs text-neutral-500 tracking-wide font-medium flex space-x-4 mx-auto md:mx-0 mt-3 mb-5 md:mb-0">
                <Link href={getSectionHref('following')} shallow replace>
                  <a className="hover:underline">
                    <p className="cursor-pointer dark:text-primary-dark-700">
                      <span className="text-neutral-800 dark:text-primary-dark-700 font-semibold mr-1 font-poppins">
                        {userDetails.followingCount}
                      </span>
                      Following
                    </p>
                  </a>
                </Link>
                <Link href={getSectionHref('followers')} shallow replace>
                  <a className="hover:underline">
                    <p className="cursor-pointer dark:text-primary-dark-700">
                      <span className="text-neutral-800 dark:text-primary-dark-700 font-semibold mr-1 font-poppins">
                        {userDetails.followedByCount}
                      </span>
                      Followers
                    </p>
                  </a>
                </Link>
              </div>
            </div>
            <div className="mx-auto md:mx-0 md:ml-auto">
              <UserProfileButton
                userName={userDetails.name || ''}
                userId={userDetails.id}
                followedByMe={userDetails.followedByMe}
              />
            </div>
          </div>
          {userDetails.bio && (
            <p className="text-center md:text-left font-medium text-neutral-600 dark:text-primary-dark-700 mt-6">
              {userDetails.bio}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfileHero;
