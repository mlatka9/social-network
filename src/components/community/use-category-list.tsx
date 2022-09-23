import { useRouter } from 'next/router';
import { useCategoryQuery } from '@/hooks/query';

const useCategoryList = () => {
  const { data, isSuccess: isCategoriesSuccess } = useCategoryQuery();
  const router = useRouter();

  const allCommunitiesCounter =
    data?.reduce((sum, n) => sum + n.communitiesCount, 0) || 0;

  const currentCategory = router.query.category as string | undefined;

  const handleChangeCategory = (categoryId: string) => {
    router.replace(
      {
        pathname: '/community',
        query: { ...router.query, category: categoryId },
      },
      undefined,
      {
        shallow: true,
        scroll: true,
      }
    );
  };

  const setAllCategories = () => {
    const { category, ...restParams } = router.query;
    router.replace(
      {
        pathname: '/community',
        query: { ...restParams },
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  };

  const filteredCategories =
    (isCategoriesSuccess &&
      data?.filter((category) => category.communitiesCount)) ||
    [];

  return {
    filteredCategories,
    setAllCategories,
    handleChangeCategory,
    currentCategory,
    allCommunitiesCounter,
    isCategoriesSuccess,
  };
};

export default useCategoryList;
