import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ButtonFollow from './button-follow';
import UserProfilePicture from './user-profile-image';

interface UserCardProps {
  id: string;
  name: string | null;
  image: string | null;
  followersCount: number;
  bio: string;
  mutualUsers: { id: string; name: string | null }[];
  followedByMe: boolean;
}

const UserCard = ({
  bio,
  followersCount,
  id,
  image,
  name,
  mutualUsers,
  followedByMe,
}: UserCardProps) => {
  const mutualUserNumber = mutualUsers.length;

  const { data: session } = useSession();
  const myId = session?.user?.id!;

  return (
    <div className="flex flex-col">
      <div className="flex mb-3">
        <UserProfilePicture imageUrl={image} userID={id} />
        <div className="ml-3">
          <Link href={`/user/${id}`}>
            <a className="font-poppins font-medium hover:underline dark:text-primary-dark-800">
              {name}
            </a>
          </Link>
          <p className=" text-neutral-500 text-xs font-medium dark:text-primary-dark-600">
            {followersCount} followers
          </p>
        </div>
        <ButtonFollow
          userName={name || ''}
          userId={id}
          isSmall
          className="ml-auto mb-auto"
          followedByMe={followedByMe}
        />
      </div>
      {bio && <p className="text-sm text-neutral-900  mb-3">{bio}</p>}

      {myId !== id && mutualUserNumber > 0 && (
        <div className=" text-sm text-neutral-600 dark:text-primary-dark-500">
          Followed by
          {mutualUsers.slice(0, 1).map((user) => (
            <Link key={user.id} href={`/user/${user.id}`}>
              <a className="mx-1 hover:underline">{user.name}</a>
            </Link>
          ))}
          {mutualUserNumber - 1 > 0 && (
            <span>and others {mutualUserNumber - 1} you follow</span>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCard;
