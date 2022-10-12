import { useFollowingQuery } from 'src/hooks/query';
import Loading from '@/components/common/loading';
import UserCard from '@/components/common/user-card';

interface FollowingListProps {
  userId: string;
}

const FollowingList = ({ userId }: FollowingListProps) => {
  const { data, isSuccess } = useFollowingQuery(userId);

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

export default FollowingList;
