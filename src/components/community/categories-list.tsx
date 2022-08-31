import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCategoryQuery } from "src/hooks/query";
import TextHeader from "../common/text-header";
import CategoriesListItem from "./categories-list-item";

const CategoryList = () => {
  const { data, isSuccess } = useCategoryQuery();
  const router = useRouter();

  const allCommunitiesCounter =
    data?.reduce((sum, n) => sum + n.communitiesCount, 0) || 0;

  const currentCategory = router.query.category as string | undefined;

  const handleChangeCategory = (url: string) => {
    router.push(url, undefined, { shallow: true });
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
        onClick={() => handleChangeCategory(`/community`)}
      />
      {filteredCategories.map((category) => (
        <CategoriesListItem
          communitiesCounter={category.communitiesCount}
          key={category.id}
          isSelected={currentCategory === category.id}
          label={category.name}
          onClick={() =>
            handleChangeCategory(`/community?category=${category.id}`)
          }
        />
      ))}
    </aside>
  );
};

export default CategoryList;
