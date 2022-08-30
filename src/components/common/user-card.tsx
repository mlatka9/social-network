import ButtonFollow from "./button-follow";
import UserProfilePicture from "./user-profile-image";

interface UserCardProps {
  id: string;
  name: string | null;
  image: string | null;
  followers: number;
  bio: string;
}

const UserCard = ({ bio, followers, id, image, name }: UserCardProps) => {
  return (
    <div className="mb-5">
      <div className="flex mb-3">
        <UserProfilePicture imageUrl={image} userID={id} />
        <div className="ml-3">
          <p className=" font-poppins font-medium">{name}</p>
          <p className=" text-neutral-500 text-xs font-medium">
            {followers} followers
          </p>
        </div>

        <ButtonFollow userId={id} />
      </div>
      <p className="text-sm text-neutral-600">{bio}</p>
    </div>
  );
};

export default UserCard;
