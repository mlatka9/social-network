import { useFollowersQuery } from 'src/hooks/query';
import UserCard from './user-card';

interface FollowersListProps {
  userId: string;
}

const FollowersList = ({ userId }: FollowersListProps) => {
  const { data, isSuccess } = useFollowersQuery(userId);

  if (!isSuccess) return <>loading...</>;

  return (
    <div className="space-y-5">
      {data.map((user) => (
        <UserCard
          key={user.id}
          bio={user.bio}
          followers={user.followersCount}
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
