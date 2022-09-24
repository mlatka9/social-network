import { useRouter } from 'next/router';

const usePost = () => {
  const router = useRouter();

  const postId = router.query.postId as string;

  return {
    postId,
  };
};

export default usePost;
