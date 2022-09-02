import { useCommunitiesQuery } from 'src/hooks/query';
import { useRouter } from 'next/router';
import CommunityCard from './community-card';

import CommunityFilter from './community-filter';

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
          role="link"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.code === 'Enter') {
              goToCommunity(community.id);
            }
          }}
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
