import { useSession } from 'next-auth/react';
import { useToggleFollowUserMutation } from 'src/hooks/mutation';
import Button from './button';

interface ButtonFollowProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  userId: string;
  isSmall?: boolean;
  followedByMe: boolean;
}

const ButtonFollow = ({
  followedByMe,
  userId,
  isSmall = false,
  ...buttonProps
}: ButtonFollowProps) => {
  const { data: session } = useSession();

  const myId = session?.user?.id!;
  const followUser = useToggleFollowUserMutation(userId);

  if (myId === userId) return null;

  return (
    <Button onClick={followUser} {...buttonProps} isSmall={isSmall}>
      {followedByMe ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

export default ButtonFollow;
