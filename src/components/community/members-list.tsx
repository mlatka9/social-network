import { useRouter } from 'next/router';
import { useCommunityMembersQuery } from 'src/hooks/query';
import Loading from '../common/loading';
import UserCard from '../common/user-card';

const Members = () => {
  const router = useRouter();
  const communityId = router.query.communityId as string;
  const { data: members, isSuccess } = useCommunityMembersQuery(communityId);

  if (!isSuccess)
    return (
      <div className="space-y-5">
        <Loading height={500} />
      </div>
    );

  return (
    <div className="space-y-5">
      {members.map((user) => (
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

export default Members;
