import { useRouter } from "next/router";
import { useCommunityMembersQuery } from "src/hooks/query";
import UserCard from "../common/user-card";

const MemebrsList = () => {
  const router = useRouter();
  const communityId = router.query.communityId as string;
  const { data: memebrs, isSuccess } = useCommunityMembersQuery(communityId);

  if (!isSuccess) return <>loading</>;

  return (
    <div>
      <div>
        {memebrs.map((user) => (
          <UserCard
            key={user.id}
            bio={user.bio}
            followers={user.followersCount}
            id={user.id}
            image={user.image}
            name={user.name}
          />
        ))}
      </div>
    </div>
  );
};

export default MemebrsList;
