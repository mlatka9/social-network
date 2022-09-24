import { useMarkAllNotificationAsRead } from "@/hooks/mutation";
import { FilterData } from "../user-profile/types";

const useNotifications = () => {
    const markAsRead = useMarkAllNotificationAsRead();

    const handleMarkAsRead = () => {
      markAsRead();
    };
  
    const filterData: FilterData[] = [
      {
        id: '1',
        displayName: 'all',
        filterName: undefined,
      },
      {
        id: '2',
        displayName: 'unread',
        filterName: 'unread',
      },
    ];
    return ({
        handleMarkAsRead,
        filterData
    })
}

export default useNotifications