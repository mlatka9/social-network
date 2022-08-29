import { useCommunitiesQuery } from "src/hooks/query";
import Link from "next/link";

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
            <div>{community.name}</div>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default CommunityList;
