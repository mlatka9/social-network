import {
  usePopularCommunitiesQuery,
  useTrendingTagsQuery,
} from "src/hooks/query";
import Link from "next/link";
import TextHeader from "@/components/common/text-header";

const PopularCommunitiesList = () => {
  const { isSuccess, data } = usePopularCommunitiesQuery();

  return (
    <aside className=" bg-white rounded-xl sticky h-fit top-[92px] dark:bg-primary-dark-100 overflow-hidden">
      <TextHeader className=" py-3 px-5 ">Popular communities</TextHeader>
      <hr className=" px-5 " />
      {isSuccess &&
        data.map((communityData) => (
          <Link
            href={`/community/${communityData.communityId}`}
            key={communityData.communityId}
          >
            <div className=" cursor-pointer hover:bg-blue-50   dark:hover:bg-primary-dark-150 px-5 py-3">
              <p className="font-bold text-neutral-800 text-md mb-2 dark:text-white">
                {`#${communityData.communityName}`}
              </p>
              <p className="font-medium text-xs text-gray-400 dark:text-white">
                {communityData.memebrsCount} members
              </p>
            </div>
          </Link>
        ))}
    </aside>
  );
};

export default PopularCommunitiesList;
