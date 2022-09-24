/* eslint-disable react/no-array-index-key */
import { useSuggestedCommunitiesQuery } from 'src/hooks/query';
import CommunityCard from '@/components/community/community-card';
import Masonry from 'react-masonry-css';
import Loading from '../common/loading';

const SuggestedCommunitiesList = () => {
  const { data, isSuccess } = useSuggestedCommunitiesQuery();

  if (isSuccess && !data.length) {
    return null;
  }

  const breakpointColumnsObj = {
    default: 2,
    768: 1,
  };

  return (
    <>
      <h2 className="font-poppins text-lg font-medium text-primary-600 mb-3 dark:text-primary-dark-600">
        Communities to join
      </h2>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {isSuccess
          ? data.map((community) => (
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
          : [120, 300, 250, 125, 200, 220].map((e, index) => (
              <div
                className="dark:bg-primary-dark-200 bg-primary-0"
                key={index}
              >
                <Loading height={e} />
              </div>
            ))}
      </Masonry>
    </>
  );
};

export default SuggestedCommunitiesList;
