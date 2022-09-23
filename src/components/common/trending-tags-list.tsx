import { useTrendingTagsQuery } from 'src/hooks/query';
import Link from 'next/link';
import TextHeader from './text-header';
import Loading from './loading';

const TrendingTagsList = () => {
  const { isSuccess, data } = useTrendingTagsQuery();

  if (isSuccess && !data.length) return null;

  return (
    <aside className=" bg-white rounded-xl dark:bg-primary-dark-200">
      <TextHeader className=" py-3 px-5 ">Trends this week</TextHeader>
      <hr className=" px-5 mx-5 dark:border-primary-700" />
      {isSuccess ? (
        data.map((tagData) => (
          <Link href={`/tag/${tagData.tagName}`} key={tagData.tagName}>
            <a className="block">
              <div className=" cursor-pointer hover:bg-blue-50 dark:hover:bg-primary-dark-300 px-5 py-3">
                <p className="font-bold text-md mb-2 ">
                  {`#${tagData.tagName}`}
                </p>
                <p className="font-medium text-xs text-gray-400 dark:text-primary-dark-600">
                  {tagData.postsCount} posts
                </p>
              </div>
            </a>
          </Link>
        ))
      ) : (
        <Loading height={360} />
      )}
    </aside>
  );
};

export default TrendingTagsList;
