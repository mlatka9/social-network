import { useSuggestedCommunitiesQuery } from 'src/hooks/query';
import CommunityCard from '@/components/community/community-card';
import Loading from '../common/loading';

const SuggestedCommunitiesList = () => {
  const { data, isSuccess } = useSuggestedCommunitiesQuery();

  return (
    <>
      <h2 className="font-poppins text-lg font-medium text-primary-600 mb-3 dark:text-primary-dark-600">
        Communities to join
      </h2>
      <div className="grid md:grid-cols-2 gap-5">
        {isSuccess ? (
          data.map((community) => (
            <div
              key={community.id}
              className="bg-primary-0 dark:bg-primary-dark-200 px-5 py-3 rounded-md"
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
          ))
        ) : (
          <>
            <div className="dark:bg-primary-dark-200">
              <Loading height={120} />
            </div>
            <div className="dark:bg-primary-dark-200">
              <Loading height={120} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SuggestedCommunitiesList;
