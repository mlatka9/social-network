import { useCommunitiesQuery } from '@/hooks/query';
import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import FallbackCard from '../common/fallback-card';
import Loading from '../common/loading';
import CommunityCard from './community-card';

const CommunityList = () => {
  const { ref, inView } = useInView();

  const router = useRouter();

  const category = router.query.category as string | undefined;
  const filter = router.query.filter as string | undefined;

  const { data, isSuccess, hasNextPage, fetchNextPage } = useCommunitiesQuery(
    category,
    filter
  );

  const getFallBackMessage = () => {
    if (filter === 'owned') return 'You can join some community 🤔';
    if (filter === 'favourite')
      return 'Your favourite communities will be there 😊';
    if (filter === 'favourite') return 'You can join any community you like 😊';
    return 'You can create first community 😊';
  };

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const goToCommunity = (communityId: string) => {
    router.push(`/community/${communityId}`);
  };

  if (!isSuccess) {
    return (
      <div className="space-y-3 bg-primary-0 dark:bg-primary-dark-200">
        <Loading height={600} />
      </div>
    );
  }

  return (
    <main className="space-y-3">
      <div className="space-y-5 mb-10">
        {data.pages.map((page) => (
          <Fragment key={page.nextCursor || 'page'}>
            {page.posts.map((community) => (
              <div
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.target !== e.currentTarget) return;
                  if (e.code === 'Enter') {
                    goToCommunity(community.id);
                  }
                }}
                onClick={() => goToCommunity(community.id)}
                key={community.id}
                className="cursor-pointer bg-primary-0 dark:bg-primary-dark-200 px-5 py-3 rounded-md"
              >
                <CommunityCard
                  isMyfavourite={community.isMyfavourite}
                  id={community.id}
                  isOwner={community.isOwner}
                  joinedByMe={community.joinedByMe}
                  categoryName={community.category.name}
                  description={community.description}
                  image={community.image}
                  membersCount={community.membersCount}
                  name={community.name}
                />
              </div>
            ))}
          </Fragment>
        ))}
        {!category && isSuccess && !data?.pages[0]?.posts.length && (
          <FallbackCard>{getFallBackMessage()}</FallbackCard>
        )}
        <div ref={ref} className="w-full h-10 " />
      </div>
    </main>
  );
};

export default CommunityList;
