/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Link from 'next/link';
import Image from 'next/image';

interface UserProfileImage {
  userID: string;
  imageUrl?: string | null;
}

const UserProfilePicture = ({ userID, imageUrl }: UserProfileImage) => (
  <Link href={`/user/${userID}`}>
    <a className="h-10" onClick={(e) => e.stopPropagation()}>
      <Image
        src={imageUrl || '/images/avatar-fallback.svg'}
        width="40"
        height="40"
        layout="fixed"
        alt=""
        className="rounded-lg"
        objectFit="cover"
      />
    </a>
  </Link>
);

export default UserProfilePicture;
