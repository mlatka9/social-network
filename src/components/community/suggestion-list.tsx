import {
  useSuggestedCommunitiesQuery,
  useSuggestedUsersQuery,
} from '@/hooks/query';
import Loading from '../common/loading';
import TextHeader from '../common/text-header';
import UserCard from '../common/user-card';
import CommunityCard from './community-card';

const SuggestionList = () => {
  const { isSuccess: isUsersSuccess, data: userData } =
    useSuggestedUsersQuery(1);
  const { isSuccess: isCommunitySuccess, data: communityData } =
    useSuggestedCommunitiesQuery(1);

  if (
    isUsersSuccess &&
    isCommunitySuccess &&
    !communityData.length &&
    !userData.length
  )
    return null;

  return (
    <aside className=" bg-white rounded-xl sticky h-fit top-[92px] dark:bg-primary-dark-200">
      <TextHeader className=" py-3 px-5 ">May interest you</TextHeader>
      <hr className=" px-5 mx-5 dark:border-primary-700" />
      {isUsersSuccess && isCommunitySuccess ? (
        <>
          {userData.map((user) => (
            <div className=" px-5 py-3 rounded-md" key={user.id}>
              <UserCard
                hasShortBio
                followedByMe={user.followedByMe}
                bio={user.bio}
                followersCount={user.followersCount}
                id={user.id}
                image={user.image}
                name={user.name}
                mutualUsers={user.mutualUsers}
              />
            </div>
          ))}
          {!!userData.length && !!communityData.length && (
            <hr className=" my-3 mx-5 dark:border-primary-700" />
          )}
          {communityData.map((community) => (
            <div className=" px-5 py-3 rounded-md" key={community.id}>
              <CommunityCard
                hasShortDescription
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
        </>
      ) : (
        <Loading height={200} />
      )}
    </aside>
  );
};

export default SuggestionList;
