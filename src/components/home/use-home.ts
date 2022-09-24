import { useInfiniteFeedQuery } from '@/hooks/query';
import { useRouter } from 'next/router';

const useHome = () => {
  const router = useRouter();

  const showcasedPostId = router.query.postId as string | undefined;
  const sort = router.query.sort as string | undefined;
  const time = router.query.time as string | undefined;

  const closeShowcasedPost = () => {
    const { postId, ...restParams } = router.query;
    router.push(
      {
        pathname: '/',
        query: { ...restParams },
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  };

  const { data, fetchNextPage, hasNextPage, isSuccess } = useInfiniteFeedQuery({
    sort,
    time,
  });


  const isPostsNotExists = isSuccess && !data?.pages[0]?.posts.length;

  return {
    isPostsNotExists,
    showcasedPostId,
    closeShowcasedPost,
    data,
    fetchNextPage,
    hasNextPage,
    isSuccess,
  };
};

export default useHome;
