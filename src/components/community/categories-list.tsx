import { useRouter } from 'next/router';
import { useCategoryQuery } from 'src/hooks/query';
import Loading from '../common/loading';
import TextHeader from '../common/text-header';
import CategoriesListItem from './categories-list-item';

const CategoryList = () => {
  const { data, isSuccess } = useCategoryQuery();
  const router = useRouter();

  const allCommunitiesCounter =
    data?.reduce((sum, n) => sum + n.communitiesCount, 0) || 0;

  const currentCategory = router.query.category as string | undefined;

  const handleChangeCategory = (categoryId: string) => {
    router.push(
      {
        pathname: '/community',
        query: { ...router.query, category: categoryId },
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  };

  const setAllCategories = () => {
    const { category, ...restParams } = router.query;
    router.push(
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
    (isSuccess && data?.filter((category) => category.communitiesCount)) || [];

  return (
    <aside className=" bg-white rounded-xl dark:bg-primary-dark-100">
      <TextHeader className=" py-3 px-5 ">Categories</TextHeader>
      <hr className=" px-5 " />
      {isSuccess ? (
        <>
          <CategoriesListItem
            communitiesCounter={allCommunitiesCounter}
            isSelected={!currentCategory}
            label="all"
            onClick={setAllCategories}
          />
          {filteredCategories.map((category) => (
            <CategoriesListItem
              communitiesCounter={category.communitiesCount}
              key={category.id}
              isSelected={currentCategory === category.id}
              label={category.name}
              onClick={() => handleChangeCategory(category.id)}
            />
          ))}
        </>
      ) : (
        <Loading height={360} />
      )}
    </aside>
  );
};

export default CategoryList;
