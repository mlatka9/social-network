import { unstable_getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import Layout from '@/components/layouts/main-layout';
import Head from 'next/head';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
import NotificationsList from '@/components/notifications/notifications-list';
import Button from '@/components/common/button';
import Filters from '@/components/user-profile/profile-filters';
import useNotifications from '@/components/notifications/use-notifications';

const Notifications = () => {
  const { filterData, handleMarkAsRead } = useNotifications();

  return (
    <>
      <Head>
        <title>Notifications</title>
        <meta property="og:title" content="Notifications" />
      </Head>
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
          <Button isSmall className="ml-auto mb-5" onClick={handleMarkAsRead}>
            mark all as read
          </Button>
          <Filters filters={filterData} />
          <NotificationsList />
        </div>
      </Layout>
    </>
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
