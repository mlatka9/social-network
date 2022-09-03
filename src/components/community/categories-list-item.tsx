import clsx from 'clsx';

interface CategoriesListItemProps {
  isSelected: boolean;
  label: string;
  onClick: () => void;
  communitiesCounter: number;
}

const CategoriesListItem = ({
  onClick,
  isSelected,
  label,
  communitiesCounter,
}: CategoriesListItemProps) => (
  <div
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.code === 'Enter') {
        onClick();
      }
    }}
    className={clsx(
      'cursor-pointer hover:bg-primary-50  dark:hover:bg-primary-dark-150 py-2 px-3 lg:px-5 lg:py-3 flex flex-col w-[130px] lg:w-full shrink-0',
      isSelected && 'bg-primary-50'
    )}
    onClick={onClick}
  >
    <p
      className={clsx(
        'font-bold text-neutral-500 text-md mb-2 dark:text-white',
        isSelected && 'bg-primary-50 text-primary-900'
      )}
    >
      {label}
    </p>
    <p className="font-medium text-xs text-gray-400 dark:text-white mt-auto">
      {communitiesCounter} communities
    </p>
  </div>
);

export default CategoriesListItem;
