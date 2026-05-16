import { useNotificationsStore } from "@/src/store/notifications.store";

export function useMarkAsRead() {
  const markOneAsRead = useNotificationsStore((state) => state.markOneAsRead);
  const markAllAsRead = useNotificationsStore((state) => state.markAllAsRead);

  return {
    markOne: markOneAsRead,
    markAll: markAllAsRead,
  };
}
