import Loading from '../common/loading';
import CategoriesListItem from './categories-list-item';
import useCategoryList from './use-category-list';

const CategoriesList = () => {
  const {
    allCommunitiesCounter,
    currentCategory,
    filteredCategories,
    handleChangeCategory,
    setAllCategories,
    isCategoriesSuccess,
  } = useCategoryList();

  return (
    <aside className="bg-white dark:bg-primary-dark-200">
      <div className="flex overflow-x-scroll lg:overflow-visible scroll-hide lg:flex-col">
        {isCategoriesSuccess ? (
          <>
            <CategoriesListItem
              communitiesCounter={allCommunitiesCounter}
              isSelected={!currentCategory}
              label="All"
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
          <>
            <div className="hidden lg:block w-full">
              <Loading height={600} />
            </div>
            <div className="lg:hidden  w-full">
              <Loading height={76} />
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default CategoriesList;
