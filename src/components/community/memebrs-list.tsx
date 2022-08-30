import clsx from "clsx";
import { useRouter } from "next/router";
import { useCommunityMembersQuery } from "src/hooks/query";
import UserCard from "../common/user-card";

const MemebrsList = () => {
  const { query } = useRouter();

  const userId = query.params?.[0]!;

  const { data: memebrs, isSuccess } = useCommunityMembersQuery(userId);
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
