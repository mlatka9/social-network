import { useSession } from 'next-auth/react';
import { useToggleFollowUserMutation } from 'src/hooks/mutation';
import { useUserQuery } from 'src/hooks/query';
import Button from './button';

interface ButtonFollowProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  userId: string;
  isSmall?: boolean;
}

const ButtonFollow = ({
  userId,
  isSmall = false,
  ...buttonProps
}: ButtonFollowProps) => {
  const { data: session } = useSession();
  const me = session?.user!;

  const { data: user } = useUserQuery(userId);

  const followUser = useToggleFollowUserMutation(userId, me.id);

  if (me.id === userId) return null;

  return (
    <Button
      className=""
      onClick={followUser}
      {...buttonProps}
      isSmall={isSmall}
    >
      {user?.followedByMe ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

export default ButtonFollow;
