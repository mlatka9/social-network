import Link from "next/link";
import Image from "next/image";

interface UserProfileImage {
  userID: string;
  imageUrl: string;
}

const UserProfilePicture = ({ userID, imageUrl }: UserProfileImage) => {
  return (
    <Link href={`/user/${userID}`} passHref>
      <a>
        <Image
          src={imageUrl}
          width="40"
          height="40"
          layout="fixed"
          alt=""
          className="rounded-lg"
        />
      </a>
    </Link>
  );
};

export default UserProfilePicture;
