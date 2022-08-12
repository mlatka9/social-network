import { trpc } from "src/utils/trpc";

interface ButtonFollowProps {
  userId: string;
}

const ButtonFollow = ({ userId }: ButtonFollowProps) => {
  const utils = trpc.useContext();

  const mutationFollowUser = trpc.useMutation("user.followUser", {
    onSuccess() {
      utils.invalidateQueries(["user.getById", { userId }]);
    },
  });

  const user = trpc.useQuery(["user.getById", { userId }]);

  const handleToggleFollow = () => {
    mutationFollowUser.mutate({ userId });
  };
  return (
    <button
      className="bg-blue-500 rounded px-6 py-2 ml-auto self-start text-white"
      onClick={handleToggleFollow}
    >
      {user.data?.followedByMe ? "Unfollow" : "Follow"}
    </button>
  );
};

export default ButtonFollow;
