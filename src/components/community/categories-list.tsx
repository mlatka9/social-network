import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCategoryQuery } from "src/hooks/query";
import TextHeader from "../common/text-header";
import CategoriesListItem from "./categories-list-item";

const CategoryList = () => {
  const { data, isSuccess } = useCategoryQuery();
  const router = useRouter();
  const basePath = router.asPath.split("?")[0];

  const allCommunitiesCounter =
    data?.reduce((sum, n) => sum + n.communitiesCount, 0) || 0;

  const currentCategory = router.query.category as string | undefined;

  const handleChangeCategory = (categoryId: string) => {
    router.push(
      {
        pathname: "/community",
        query: { ...router.query, category: categoryId },
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
    // url, undefined, { shallow: true }
  };

  const setAllCategories = () => {
    const { category, ...restParams } = router.query;
    router.push(
      {
        pathname: "/community",
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
    </aside>
  );
};

export default CategoryList;
