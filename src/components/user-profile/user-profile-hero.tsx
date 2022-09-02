import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import UserProfileButton from './user-profile-button';
import Loading from '../common/loading';
import { UserDetailsType } from '@/types/db';

interface UserProfileHeroProps {
  userDetails: UserDetailsType | undefined;
}

const UserProfileHero = ({ userDetails }: UserProfileHeroProps) => {
  const router = useRouter();

  if (!userDetails) {
    return (
      <div className="mb-10">
        <Loading height={440} />
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-80 relative">
        <Image
          alt=""
          layout="fill"
          objectFit="cover"
          src={userDetails?.bannerImage || '/images/fallback.svg'}
        />
      </div>

      <div className="flex p-6 min-h-[160px] rounded-xl bg-primary-0 dark:bg-primary-dark-100 mb-10 relative -mt-10">
        <div className="relative -mt-20 p-1 bg-primary-0 dark:bg-primary-dark-100 rounded-lg shrink-0">
          <Image
            src={userDetails?.image || '/images/fallback.svg'}
            width="150"
            height="150"
            className="rounded-lg"
            alt=""
            objectFit="cover"
          />
        </div>

        <div className="ml-4 w-full">
          <div className="flex items-baseline justify-between">
            <h1 className="font-poppins font-semibold text-2xl max-w-[150px]">
              {userDetails?.name}
            </h1>

            <div className="text-xs  text-neutral-500 tracking-wide font-medium flex space-x-4 ">
              <Link href={`${router.asPath}/following`} shallow>
                <a className="hover:underline">
                  <p className="cursor-pointer dark:text-primary-dark-700">
                    <span className="text-neutral-800 dark:text-primary-dark-700 font-semibold mr-1 font-poppins">
                      {userDetails.followingCount}
                    </span>
                    Following
                  </p>
                </a>
              </Link>
              <Link href={`${router.asPath}/followers`} shallow>
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
            <div className="">
              <UserProfileButton
                userId={userDetails.id}
                followedByMe={userDetails.followedByMe}
              />
            </div>
          </div>
          <p className="font-medium text-neutral-600 dark:text-primary-dark-700 mt-6 max-w-sm">
            {userDetails.bio}
          </p>
        </div>
      </div>
    </>
  );
};

export default UserProfileHero;
