import {
  useSuggestedCommunitiesQuery,
  useSuggestedUsersQuery,
} from '@/hooks/query';

const useExplore = () => {
  const { data: users, isSuccess: isUsersSuccess } = useSuggestedUsersQuery();
  const { data: communities, isSuccess: isCommunitiesSuccess } =
    useSuggestedCommunitiesQuery();

  const isNotExploreData =
    isUsersSuccess &&
    isCommunitiesSuccess &&
    (!users.length && !communities.length);

  return {
    isNotExploreData,
  };
};

export default useExplore;
