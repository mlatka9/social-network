import { useNotificationsQuery } from 'src/hooks/query';
import { unstable_getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import Layout from '@/components/layouts/main-layout';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import NotificationsList from '@/components/notifications/notifications-list';
import Button from '@/components/common/button';
import { useMarkAllNotificationAsRead } from '@/hooks/mutation';

const Notifications = () => {
  const { data, fetchNextPage, hasNextPage, isSuccess } =
    useNotificationsQuery();
  const markAsRead = useMarkAllNotificationAsRead();

  const onClick = () => {
    markAsRead();
  };

  return (
    <Layout>
      <h1 className="font-poppins mb-10 mt-5 ">
        <p className="font-bold text-neutral-800 dark:text-primary-dark-800 text-2xl">
          Notifications
        </p>
        <p className="text-neutral-600 dark:text-primary-dark-700 font-normal">
          discover
        </p>
      </h1>
      <div className="flex flex-col">
        <Button isSmall className="ml-auto mb-3" onClick={onClick}>
          mark all as read
        </Button>
        <NotificationsList
          data={data}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
        />
        {isSuccess && !data?.pages[0]?.notifications.length && (
          <div className="bg-primary-0 dark:bg-primary-dark-200 p-3 rounded-xl text-primary-500 dark:text-primary-dark-700 flex items-center min-h-[100px] text-lg">
            {`if someone marks you, we'll let you know 🤔`}
          </div>
        )}
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Notifications;
