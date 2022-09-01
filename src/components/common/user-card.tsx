import Link from "next/link";
import ButtonFollow from "./button-follow";
import UserProfilePicture from "./user-profile-image";

interface UserCardProps {
  id: string;
  name: string | null;
  image: string | null;
  followers: number;
  bio: string;
  mutualUsers: { id: string; name: string | null }[];
}

const UserCard = ({
  bio,
  followers,
  id,
  image,
  name,
  mutualUsers,
}: UserCardProps) => {
  const mutualUserNumber = mutualUsers.length;

  return (
    <div className="flex flex-col">
      <div className="flex mb-3">
        <UserProfilePicture imageUrl={image} userID={id} />
        <div className="ml-3">
          <Link href={`/user/${id}`}>
            <a className="font-poppins font-medium hover:underline">{name}</a>
          </Link>
          <p className=" text-neutral-500 text-xs font-medium">
            {followers} followers
          </p>
        </div>
        <ButtonFollow userId={id} isSmall />
      </div>
      {bio && <p className="text-sm text-neutral-900  mb-3">{bio}</p>}

      {mutualUserNumber > 0 && id && (
        <div className=" text-sm text-neutral-600">
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
