/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useMarkNotificationAsRead } from "@/hooks/mutation";
import { NotificationStartFollowType } from "@/types/db";
import Link from "next/link";
import Image from 'next/image'
import ReactTimeAgo from "react-time-ago";

interface NotificationStartFolowCardProps {
    notification: NotificationStartFollowType;
  }

const NotificationsStartFollowCard = ({notification}:NotificationStartFolowCardProps) => {
    const markAsReaded = useMarkNotificationAsRead();

    const onClick = () => {
      markAsReaded({ notificationId: notification.id });
    };
    return (
        <Link href={`user/${notification.userId}`}>
        <a className="block" onClick={onClick}>
          <div className=" bg-primary-0 dark:bg-primary-dark-200 px-5 py-3 flex items-center text-primary-600 rounded-lg">
            <Image
              src={notification.user.image || '/images/fallback.svg'}
              width={40}
              height={40}
              alt=""
              objectFit="cover"
              className="rounded-lg"
            />
            <div className="ml-3 flex flex-col">
              <p className="dark:text-primary-dark-600">
                <span className="font-medium text-primary-800 dark:text-primary-dark-800 mr-1">
                  {notification.user.name}
                </span>
                has started followed you
              </p>
              <ReactTimeAgo
                date={notification.createdAt}
                className="font-medium text-xs text-gray-400 dark:text-primary-dark-600"
              />
            </div>
          </div>
        </a>
      </Link>
    )
}

export default NotificationsStartFollowCard;