import Loading from '../common/loading';
import TextHeader from '../common/text-header';
import CategoriesListItem from './categories-list-item';
import useCategoryList from './use-category-list';

const CategoryList = () => {
  const {
    allCommunitiesCounter,
    currentCategory,
    filteredCategories,
    handleChangeCategory,
    setAllCategories,
    isCategoriesSuccess,
  } = useCategoryList();

  return (
    <aside className=" bg-white rounded-xl dark:bg-primary-dark-100">
      <TextHeader className=" py-3 px-5 ">Categories</TextHeader>
      <hr className=" px-5 " />
      {isCategoriesSuccess ? (
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
