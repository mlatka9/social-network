import { useSession } from 'next-auth/react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import ButtonFollow from '@/components/common/button-follow';
import Button from '../common/button';

interface UserProfileButtonProps {
  userId: string;
  followedByMe: boolean;
}
const UserProfileButton = ({
  followedByMe,
  userId,
}: UserProfileButtonProps) => {
  const { asPath } = useRouter();
  const { data: session } = useSession();
  const currentUser = session?.user!;

  if (userId !== currentUser.id) {
    return <ButtonFollow userId={userId} followedByMe={followedByMe} />;
  }

  return (
    <Link href={`${asPath}/settings`} shallow>
      <a className="ml-auto">
        <Button>Settings</Button>
      </a>
    </Link>
  );
};

export default UserProfileButton;
