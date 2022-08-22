import { useTrendingTagsQuery } from "src/hooks/query";
import Link from "next/link";

const TrendingTagsList = () => {
  const { isSuccess, data } = useTrendingTagsQuery();

  return (
    <aside className=" bg-white rounded-xl sticky h-fit top-[92px]">
      <h2 className="font-poppins font-semibold text-neutral-700 text-sm py-3 px-5 ">
        Trends for you
      </h2>
      <hr className=" px-5 " />
      {isSuccess &&
        data.map((tagData) => (
          <Link href={`/tag/${tagData.tagName}`} key={tagData.tagName}>
            <div className=" cursor-pointer hover:bg-blue-50 px-5 py-3">
              <p className="font-bold text-neutral-800 text-md mb-2">
                {`#${tagData.tagName}`}
              </p>
              <p className="font-medium text-xs text-gray-400">
                {tagData.postsCount}
              </p>
            </div>
          </Link>
        ))}
    </aside>
  );
};

export default TrendingTagsList;
