import { useRouter } from 'next/router';
import { useCommunityMembersQuery } from 'src/hooks/query';
import UserCard from '../common/user-card';

const Members = () => {
  const router = useRouter();
  const communityId = router.query.communityId as string;
  const { data: members, isSuccess } = useCommunityMembersQuery(communityId);

  if (!isSuccess) return <>loading</>;

  return (
    <div className="space-y-5">
      {members.map((user) => (
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

export default Members;
