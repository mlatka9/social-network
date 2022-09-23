/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useMarkNotificationAsRead } from '@/hooks/mutation';
import clsx from 'clsx';
import Image from 'next/image';

interface NotificationCardWrapperProps {
  imageUrl: string | null;
  children: React.ReactNode;
  isRead: boolean;
  notificationId: string;
}

const NotificationCardWrapper = ({
  isRead,
  children,
  imageUrl,
  notificationId,
}: NotificationCardWrapperProps) => {
  const markAsRead = useMarkNotificationAsRead();

  const handleMarkAsRead = () => {
    markAsRead({ notificationId });
  };

  return (
    <div
      className={clsx(
        'bg-primary-0 dark:bg-primary-dark-200 px-5 py-3 flex items-start text-primary-600 rounded-lg relative',
        isRead && 'bg-primary-50 dark:bg-primary-dark-200/60'
      )}
      onClick={handleMarkAsRead}
    >
      <Image
        src={imageUrl || '/images/avatar-fallback.svg'}
        width={40}
        height={40}
        alt=""
        objectFit="cover"
        className="rounded-lg"
      />
      {!isRead && (
        <div className="w-3 h-3 bg-blue-500 rounded-full absolute right-3 top-3" />
      )}

      <div className="ml-3 flex flex-col w-full">{children}</div>
    </div>
  );
};

export default NotificationCardWrapper;
