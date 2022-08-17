import { trpc } from "src/utils/trpc";

interface ButtonFollowProps {
  userId: string;
}

const ButtonFollow = ({ userId }: ButtonFollowProps) => {
  const utils = trpc.useContext();

  // console.log("userId", userId);

  const user = trpc.useQuery(["user.getById", { userId }], {
    retry: false,
  });

  const me = trpc.useQuery(["user.me"]);

  const mutationFollowUser = trpc.useMutation("user.followUser", {
    onSuccess() {
      utils.invalidateQueries(["user.getById", { userId }]);
    },
  });

  const handleToggleFollow = () => {
    mutationFollowUser.mutate({ userId });
  };

  // console.log("moje id", me.data?.id, "jego id", userId);

  if (me.data?.id === userId) return <>To ja</>;

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