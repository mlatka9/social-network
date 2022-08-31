import clsx from "clsx";
import Link from "next/link";

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
}: CategoriesListItemProps) => {
  return (
    <div
      className={clsx(
        "cursor-pointer hover:bg-primary-50  dark:hover:bg-primary-dark-150 px-5 py-3",
        isSelected && "bg-primary-50"
      )}
      onClick={onClick}
    >
      <p
        className={clsx(
          "font-bold text-neutral-500 text-md mb-2 dark:text-white",
          isSelected && "bg-primary-50 text-primary-900"
        )}
      >
        {label}
      </p>
      <p className="font-medium text-xs text-gray-400 dark:text-white">
        {communitiesCounter} communities
      </p>
    </div>
  );
};

export default CategoriesListItem;
