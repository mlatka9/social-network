import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CommunityFilterType } from 'src/server/router/types';

const CommunityFilter = () => {
  const router = useRouter();
  const selectedFilter = router.query.filter as string | undefined;
  const basePath = router.asPath.split('?')[0];

  const getAllQuery = () => {
    const { filter, ...restParams } = router.query;
    return { ...restParams };
  };

  return (
    <ul className="grid grid-cols-4 bg-primary-0  p-1 rounded-lg mb-5">
      <li>
        <Link
          href={{
            pathname: basePath,
            query: getAllQuery(),
          }}
          shallow
          scroll={false}
          replace
        >
          <a
            className={clsx(
              'flex items-center justify-center py-1 rounded-md transition-colors text-primary-400',
              !selectedFilter && 'bg-slate-100 !text-primary-900 font-medium'
            )}
          >
            all
          </a>
        </Link>
      </li>
      <li>
        <Link
          href={{
            pathname: basePath,
            query: { ...router.query, filter: CommunityFilterType.JOINED },
          }}
          shallow
          scroll={false}
          replace
        >
          <a
            className={clsx(
              'flex items-center justify-center py-1 rounded-md transition-colors text-primary-400',
              selectedFilter === CommunityFilterType.JOINED &&
                'bg-slate-100 !text-primary-900 font-medium'
            )}
          >
            joined
          </a>
        </Link>
      </li>
      <li>
        <Link
          href={{
            pathname: basePath,
            query: { ...router.query, filter: CommunityFilterType.OWNED },
          }}
          shallow
          scroll={false}
          replace
        >
          <a
            className={clsx(
              'flex items-center justify-center py-1 rounded-md bg-primary-0 transition-colors text-primary-400',
              selectedFilter === CommunityFilterType.OWNED &&
                'bg-slate-100 !text-primary-900 font-medium'
            )}
          >
            owned
          </a>
        </Link>
      </li>
      <li>
        <Link
          href={{
            pathname: basePath,
            query: { ...router.query, filter: CommunityFilterType.FAVOURITE },
          }}
          shallow
          scroll={false}
          replace
        >
          <a
            className={clsx(
              'flex items-center justify-center py-1 rounded-md transition-colors text-primary-400',
              selectedFilter === CommunityFilterType.FAVOURITE &&
                'bg-slate-100 !text-primary-900 font-medium'
            )}
          >
            favourite
          </a>
        </Link>
      </li>
    </ul>
  );
};

export default CommunityFilter;
