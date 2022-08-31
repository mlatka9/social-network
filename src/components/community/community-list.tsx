import { useCommunitiesQuery } from "src/hooks/query";
import Link from "next/link";
import CommunityCard from "./community-card";
import { useRouter } from "next/router";

const CommunityList = () => {
  const router = useRouter();

  const category = router.query.category as string | undefined;

  const { data, isSuccess } = useCommunitiesQuery(category);

  if (!isSuccess) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {data.map((community) => (
        <Link href={`/community/${community.id}`} key={community.id}>
          <a>
            <CommunityCard
              isOwner={community.isOwner}
              joinedByMe={community.joinedByMe}
              categoryName={community.category.name}
              description={community.description}
              image={community.image}
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
