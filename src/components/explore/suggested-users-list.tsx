import { useSuggestedUsersQuery } from 'src/hooks/query';
import Loading from '../common/loading';
import UserCard from '../common/user-card';

const SuggestedUsersList = () => {
  const { data, isSuccess } = useSuggestedUsersQuery();

  // if (!isSuccess) return <>loading...</>;
  return (
    <>
      <h2 className="font-poppins text-lg font-medium text-primary-600 mb-3">
        Users to follow
      </h2>
      <div className="grid grid-cols-2 gap-5">
        {isSuccess ? (
          data.map((user) => (
            <div key={user.id} className="bg-primary-0 px-5 py-3 rounded-md">
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
        ) : (
          <>
            <Loading height={120} />
            <Loading height={120} />
          </>
        )}
      </div>
    </>
  );
};

export default SuggestedUsersList;
