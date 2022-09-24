import { useRouter } from 'next/router';
import { usePostsWithTagQuery } from 'src/hooks/query';

const useTag = () => {
  const router = useRouter();

  const tagName = router.query.tagName as string;
  const { data, fetchNextPage, hasNextPage } = usePostsWithTagQuery(tagName);

  return {
    tagName,
    data,
    fetchNextPage,
    hasNextPage,
  };
};

export default useTag;
