import clsx from 'clsx';
import { useRouter } from 'next/router';
import ProfileFilterItem from './profile-filter-item';

const ProfileFilters = () => {
  const router = useRouter();

  const selectedFilter = router.query?.filter as string | undefined;
  return (
    <div className="relative flex w-full bg-primary-0 dark:bg-primary-dark-200 font-poppins font-semibold text-primary-500 dark:text-primary-dark-600 tracking-wide text-sm rounded-lg mb-3">
      <div
        className={clsx(
          'h-1 absolute left-0 top-0 w-1/3 transition-transform ite',
          selectedFilter === 'images' && 'translate-x-full',
          selectedFilter === 'likes' && 'translate-x-[200%]'
        )}
      >
        <div className="w-24 h-1 rounded-b-md left-1/2 -translate-x-1/2 bg-blue-500 absolute" />
      </div>
      <ProfileFilterItem filterName={undefined} displayText="posts & shares" />
      <ProfileFilterItem filterName="images" displayText="images" />
      <ProfileFilterItem filterName="likes" displayText="likes" />
    </div>
  );
};

export default ProfileFilters;
