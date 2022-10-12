import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import FollowingList from '@/components/user/following-list';
import FollowersList from './followers-list';

interface FollowersListProps {
  section: 'followers' | 'following';
  userId: string;
}

const UserFollows = ({ section, userId }: FollowersListProps) => {
  const router = useRouter();
  const basePath = router.asPath.split('?')[0];

  const getSectionHref = (sectionName: 'following' | 'followers') => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { userId, ...restParams } = router.query;
    return {
      pathname: basePath,
      query: { ...restParams, section: sectionName },
    };
  };

  return (
    <>
      <div className="flex font-poppins font-semibold pb-10 justify-center space-x-10">
        <div>
          <Link href={getSectionHref('following')} shallow>
            <a>
              <div>Following</div>
            </a>
          </Link>

          <div
            className={clsx([
              'bg-blue-500 w-full h-1 opacity-0 transition-opacity',
              section === 'following' && 'opacity-100',
            ])}
          />
        </div>
        <div>
          <Link href={getSectionHref('followers')} shallow>
            <a>
              <div>Followers</div>
            </a>
          </Link>
          <div
            className={clsx([
              'bg-blue-500 w-full h-1 opacity-0 transition-opacity',
              section === 'followers' && 'opacity-100',
            ])}
          />
        </div>
      </div>
      {section === 'followers' && <FollowersList userId={userId} />}
      {section === 'following' && <FollowingList userId={userId} />}
    </>
  );
};

export default UserFollows;
