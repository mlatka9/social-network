import { useFollowersQuery } from 'src/hooks/query';
import Loading from '../common/loading';
import UserCard from '../common/user-card';

interface FollowersListProps {
  userId: string;
}

const FollowersList = ({ userId }: FollowersListProps) => {
  const { data, isSuccess } = useFollowersQuery(userId);

  if (!isSuccess) return <Loading height={500} />;

  return (
    <div className="space-y-5">
      {data.map((user) => (
        <UserCard
          followedByMe={user.followedByMe}
          key={user.id}
          bio={user.bio}
          followersCount={user.followersCount}
          id={user.id}
          image={user.image}
          name={user.name}
          mutualUsers={user.mutualUsers}
        />
      ))}
    </div>
  );
};

export default FollowersList;
