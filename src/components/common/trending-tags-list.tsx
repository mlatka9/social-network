import { useTrendingTagsQuery } from "src/hooks/query";
import Link from "next/link";
import TextHeader from "./text-header";

const TrendingTagsList = () => {
  const { isSuccess, data } = useTrendingTagsQuery();

  return (
    <aside className=" bg-white rounded-xl sticky h-fit top-[92px] dark:bg-primary-dark-100 overflow-hidden">
      <TextHeader className=" py-3 px-5 ">Trends for you</TextHeader>
      <hr className=" px-5 " />
      {isSuccess &&
        data.map((tagData) => (
          <Link href={`/tag/${tagData.tagName}`} key={tagData.tagName}>
            <div className=" cursor-pointer hover:bg-blue-50   dark:hover:bg-primary-dark-150 px-5 py-3">
              <p className="font-bold text-neutral-800 text-md mb-2 dark:text-white">
                {`#${tagData.tagName}`}
              </p>
              <p className="font-medium text-xs text-gray-400 dark:text-white">
                {tagData.postsCount}
              </p>
            </div>
          </Link>
        ))}
    </aside>
  );
};

export default TrendingTagsList;
