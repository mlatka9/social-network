import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { SearchType } from 'src/server/router/types';
import { SearchEntryType } from '@/types/db';

interface SearchCardProps {
  searchEntry: SearchEntryType;
  isSelected: boolean;
}

const SearchCard = ({ searchEntry, isSelected }: SearchCardProps) => (
  <Link
    href={
      searchEntry.type === SearchType.USER
        ? `/user/${searchEntry.id}`
        : `/community/${searchEntry.id}`
    }
    key={searchEntry.id}
    passHref
  >
    <a className="focus:bg-red-300 focus:outline-none block">
      <div
        className={clsx([
          'flex items-center p-3 hover:bg-primary-100 hover:dark:bg-primary-dark-200',
          isSelected && 'bg-primary-100 dark:bg-primary-dark-200',
        ])}
      >
        <div className="w-10 h-10 relative mr-2">
          <Image
            src={searchEntry.image || '/images/fallback.svg'}
            width="40"
            height="40"
            alt=""
            className="rounded-lg"
            objectFit="cover"
          />
        </div>

        <div className="">
          <p className="p-1 block font-medium pb-0">{searchEntry.title}</p>
          <p className="p-1 block font-medium text-xs text-gray-400 pt-0">
            {searchEntry.type === SearchType.USER
              ? `${searchEntry.followersCount} followers`
              : `${searchEntry.followersCount} members`}
          </p>
        </div>
      </div>
    </a>
  </Link>
);

export default SearchCard;
