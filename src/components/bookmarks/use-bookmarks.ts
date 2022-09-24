import { useUserBookmarkedPostsQuery } from '@/hooks/query';

const useBookmarks = () => {
  const { data, fetchNextPage, hasNextPage, isSuccess } =
    useUserBookmarkedPostsQuery();

  const isBookmarksNotExists = isSuccess && !data?.pages[0]?.posts.length;

  return {
    isBookmarksNotExists,
    data,
    fetchNextPage,
    hasNextPage,
  };
};

export default useBookmarks;
