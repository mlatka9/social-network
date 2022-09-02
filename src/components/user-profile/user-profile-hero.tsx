import Link from 'next/link';
import Image from 'next/image';
import { useUserQuery } from 'src/hooks/query';
import { useRouter } from 'next/router';
import UserProfileButton from './user-profile-button';

const UserProfileHero = () => {
  const { query, asPath } = useRouter();
  const userId = query.params?.[0]!;

  const { data: user, status } = useUserQuery(userId);

  if (status === 'error') return <div>Cant find user</div>;
  if (status !== 'success') return <div>Loading</div>;

  return (
    <>
      <div className="w-full h-80 relative">
        <Image
          alt=""
          layout="fill"
          objectFit="cover"
          src={user?.bannerImage || '/images/fallback.svg'}
        />
      </div>

      <div className="flex p-6 min-h-[160px] rounded-xl bg-primary-0 dark:bg-primary-dark-100 mb-10 relative -mt-10">
        <div className="relative -mt-20 p-1 bg-primary-0 dark:bg-primary-dark-100 rounded-lg shrink-0">
          <Image
            src={user?.image || '/images/fallback.svg'}
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
              {user?.name}
            </h1>

            <div className="text-xs  text-neutral-500 tracking-wide font-medium flex ml-7 space-x-4 ">
              <Link href={`${asPath}/following`} shallow>
                <a className="hover:underline">
                  <p className="cursor-pointer dark:text-primary-dark-700">
                    <span className="text-neutral-800 dark:text-primary-dark-700 font-semibold mr-1 font-poppins">
                      {user.followingCount}
                    </span>
                    Following
                  </p>
                </a>
              </Link>
              <Link href={`${asPath}/followers`} shallow>
                <a className="hover:underline">
                  <p className="cursor-pointer dark:text-primary-dark-700">
                    <span className="text-neutral-800 dark:text-primary-dark-700 font-semibold mr-1 font-poppins">
                      {user.followedByCount}
                    </span>
                    Followers
                  </p>
                </a>
              </Link>
            </div>
            <div className="ml-auto">
              <UserProfileButton userId={userId} />
            </div>
          </div>
          <p className="font-medium text-neutral-600 dark:text-primary-dark-700 mt-6 max-w-sm">
            {user.bio}
          </p>
        </div>
      </div>
    </>
  );
};

export default UserProfileHero;
