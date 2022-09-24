/* eslint-disable react/no-array-index-key */
import { useSuggestedUsersQuery } from 'src/hooks/query';
import Masonry from 'react-masonry-css';
import Loading from '../common/loading';
import UserCard from '../common/user-card';

const SuggestedUsersList = () => {
  const { data, isSuccess } = useSuggestedUsersQuery();

  if (isSuccess && !data.length) {
    return null;
  }

  const breakpointColumnsObj = {
    default: 2,
    768: 1,
  };

  return (
    <>
      <h2 className="font-poppins text-lg font-medium text-primary-600 dark:text-primary-dark-600 mb-3">
        Users to follow
      </h2>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {isSuccess
          ? data.map((user) => (
              <div
                key={user.id}
                className="bg-primary-0 dark:bg-primary-dark-200 px-5 py-3 rounded-md"
              >
                <UserCard
                  followedByMe={user.followedByMe}
                  bio={user.bio}
                  id={user.id}
                  followersCount={user.followersCount}
                  image={user.image}
                  name={user.name}
                  mutualUsers={user.mutualUsers}
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

export default SuggestedUsersList;
