import clsx from 'clsx';
import { useRouter } from 'next/router';
import ProfileFilterItem from './profile-filter-item';

import type { FilterData } from './types';

interface ProfileFiltersProps {
  filters: FilterData[];
}

const Filters = ({ filters }: ProfileFiltersProps) => {
  const router = useRouter();

  const selectedFilter = router.query?.filter as string | undefined;

  const selectedFilterIndex = filters.findIndex(
    (filter) => filter.filterName === selectedFilter
  );

  return (
    <div className="relative flex w-full bg-primary-0 dark:bg-primary-dark-200 font-poppins font-semibold text-primary-500 dark:text-primary-dark-600 tracking-wide text-sm rounded-lg mb-3">
      <div
        className={clsx('h-1 absolute left-0 top-0 transition-transform')}
        style={{
          transform: `translateX(${selectedFilterIndex * 100}%)`,
          width: `${(1 / filters.length) * 100}%`,
        }}
      >
        <div className="w-24 h-1 rounded-b-md left-1/2 -translate-x-1/2 bg-blue-500 absolute" />
      </div>
      {filters.map((filter) => (
        <ProfileFilterItem
          key={filter.id}
          filterName={filter.filterName}
          displayText={filter.displayName}
        />
      ))}
    </div>
  );
};

export default Filters;
