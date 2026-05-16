import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  AppNotification,
  NotificationAccountType,
} from "@/src/features/notifications/types/notification.types";
import { notificationsMock } from "@/src/mocks/notifications.mock";

type NotificationsState = {
  notifications: AppNotification[];
  activeAccountType: NotificationAccountType;

  setActiveAccountType: (accountType: NotificationAccountType) => void;
  markOneAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  resetNotifications: () => void;
};

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set) => ({
      notifications: notificationsMock,
      activeAccountType: "personal",

      setActiveAccountType: (accountType) =>
        set({
          activeAccountType: accountType,
        }),

      markOneAsRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification,
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.recipientAccountType === state.activeAccountType
              ? { ...notification, isRead: true }
              : notification,
          ),
        })),

      resetNotifications: () =>
        set({
          notifications: notificationsMock,
        }),
    }),
    {
      name: "notifications-storage",
      storage: createJSONStorage(() => ({
        getItem: SecureStore.getItemAsync,
        setItem: SecureStore.setItemAsync,
        removeItem: SecureStore.deleteItemAsync,
      })),
    },
  ),
);
