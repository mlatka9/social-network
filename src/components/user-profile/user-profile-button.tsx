import { useSession } from 'next-auth/react';
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
  const { data: session } = useSession();
  const router = useRouter();
  const currentUser = session?.user!;

  if (userId !== currentUser.id) {
    return <ButtonFollow userId={userId} followedByMe={followedByMe} />;
  }

  const openCommuntiSettingsModal = () => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { section, userId, ...restParams } = router.query;

    router.push(
      {
        pathname: `/user/${userId}`,
        query: { ...restParams, section: 'settings' },
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  };

  return <Button onClick={openCommuntiSettingsModal}>Settings</Button>;
};

export default UserProfileButton;
