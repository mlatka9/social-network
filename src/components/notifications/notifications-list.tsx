import { useInView } from 'react-intersection-observer';
import { useEffect, Fragment } from 'react';
import { InfiniteData } from '@tanstack/react-query';
import { NotificationType } from '@/types/db';
import Loading from '../common/loading';
import NotificationCard from './notification-card';

interface NotificationInfinityData {
  notifications: NotificationType[];
  nextCursor: string | undefined;
}

interface NotificationsListProps {
  data: InfiniteData<NotificationInfinityData> | undefined;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
}

const NotificationsList = ({
  data,
  fetchNextPage,
  hasNextPage,
}: NotificationsListProps) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (!data)
    return (
      <div className="space-y-5 ">
        <div className="dark:bg-primary-dark-200 bg-primary-0">
          <Loading height={64} />
        </div>
        <div className="dark:bg-primary-dark-200 bg-primary-0">
          <Loading height={70} />
        </div>
        <div className="dark:bg-primary-dark-200 bg-primary-0">
          <Loading height={64} />
        </div>
      </div>
    );

  return (
    <div className="space-y-5 mb-10">
      {data.pages.map((page) => (
        <Fragment key={page.nextCursor || 'page'}>
          {page.notifications.map((notification) => (
            <NotificationCard
              key={notification.postId}
              notification={notification}
            />
          ))}
        </Fragment>
      ))}
      {hasNextPage && <div ref={ref} className="w-full h-10 " />}
    </div>
  );
};

export default NotificationsList;
