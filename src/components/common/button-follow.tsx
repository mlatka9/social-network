import { useSession } from "next-auth/react";
import { useToggleFollowUserMutation } from "src/hooks/mutation";
import { useUserQuery } from "src/hooks/query";
import Button from "./button";

interface ButtonFollowProps {
  userId: string;
}

const ButtonFollow = ({ userId }: ButtonFollowProps) => {
  const { data: session } = useSession();
  const me = session?.user!;

  const { data: user } = useUserQuery(userId);

  const followUser = useToggleFollowUserMutation(userId, me.id);

  if (me.id === userId) return null;

  return (
    <Button className="" onClick={followUser}>
      {user?.followedByMe ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default ButtonFollow;
