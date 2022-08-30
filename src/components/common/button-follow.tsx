import { useSession } from "next-auth/react";
import { useToggleFollowUserMutation } from "src/hooks/mutation";
import { useUserQuery } from "src/hooks/query";

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
    <button
      className="bg-blue-500 rounded px-6 py-2 ml-auto self-start text-white"
      onClick={followUser}
    >
      {user?.followedByMe ? "Unfollow" : "Follow"}
    </button>
  );
};

export default ButtonFollow;
