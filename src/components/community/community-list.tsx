import { useCommunitiesQuery } from "src/hooks/query";
import Link from "next/link";
import CommunityCard from "./community-card";

const CommunityList = () => {
  const { data, isSuccess } = useCommunitiesQuery();

  if (!isSuccess) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {data.map((community) => (
        <Link href={`/community/${community.id}`} key={community.id}>
          <a>
            <CommunityCard
              description={community.description}
              id={community.id}
              image={community.image}
              joinedByMe={community.joinedByMe}
              memebrsCount={community.membersCount}
              name={community.name}
            />
          </a>
        </Link>
      ))}
    </div>
  );
};

export default CommunityList;
