import { useCommunityDetailsQuery, useCommunityPostsQuery } from "@/hooks/query";
import { useRouter } from "next/router";

const useCommunity = () => {
    const router = useRouter();

    const communityId = router.query.communityId as string;
    const section = router.query.section as string | undefined;
    const sort = router.query.sort as string | undefined;
    const time = router.query.time as string | undefined;
  
    const {
      data: community,
      isError,
      isSuccess: isDetailsSuccess,
    } = useCommunityDetailsQuery(communityId);
  
    const {
      data: posts,
      fetchNextPage,
      hasNextPage,
    } = useCommunityPostsQuery({ communityId, sort, time, enabled: !section });

    return ({
        communityId,
        community,
        isError,
        isDetailsSuccess,
        posts,
        fetchNextPage,
        hasNextPage,
    })
}

export default useCommunity