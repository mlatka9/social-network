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
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      'block  hover:text-primary-700 hover:dark:bg-primary-dark-300 relative text-center w-[200px] lg:w-full shrink-0',
      isSelected && '!text-blue-500'
    )}
  >
    <div
      className={clsx(
        'transition-opacity w-24 h-1 rounded-b-md left-1/2 -translate-x-1/2 bg-blue-500 absolute opacity-0 lg:h-14 lg:w-1 lg:left-0 lg:translate-x-0 lg:top-1/2 lg:-translate-y-1/2 lg:rounded-none lg:rounded-br-md lg:rounded-tr-md',
        isSelected && 'opacity-100'
      )}
    />
    <div className="p-5 lg:text-left">
      <p
        className={clsx(
          'font-poppins font-semibold text-primary-500 dark:text-primary-dark-800 tracking-wide text-sm lg:mb-2',
          isSelected && '!text-blue-500'
        )}
      >
        {label}
      </p>
      <p
        className={clsx(
          'font-medium text-xs text-gray-400 dark:text-primary-dark-600',
          isSelected && '!text-blue-400'
        )}
      >
        {communitiesCounter} communities
      </p>
    </div>
  </button>
);

export default CategoriesListItem;
