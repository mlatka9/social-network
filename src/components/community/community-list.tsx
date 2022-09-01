import { useCommunitiesQuery } from "src/hooks/query";
import CommunityCard from "./community-card";
import { useRouter } from "next/router";
import CommunityFilter from "./community-filter";

const CommunityList = () => {
  const router = useRouter();

  const category = router.query.category as string | undefined;
  const filter = router.query.filter as string | undefined;

  const { data, isSuccess } = useCommunitiesQuery(category, filter);

  const goToCommunity = (communityId: string) => {
    router.push(`/community/${communityId}`);
  };

  if (!isSuccess) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <CommunityFilter />
      {data.map((community) => (
        <div
          onClick={() => goToCommunity(community.id)}
          key={community.id}
          className="cursor-pointer"
        >
          <CommunityCard
            isMyfavourite={community.isMyfavourite}
            id={community.id}
            isOwner={community.isOwner}
            joinedByMe={community.joinedByMe}
            categoryName={community.category.name}
            description={community.description}
            image={community.image}
            membersCount={community.membersCount}
            name={community.name}
          />
        </div>
      ))}
    </div>
  );
};

export default CommunityList;
