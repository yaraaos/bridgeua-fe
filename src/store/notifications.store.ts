import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  AppNotification,
  NotificationAccountType,
} from "@/src/features/notifications/types/notification.types";

type ReadNotificationsMap = Record<NotificationAccountType, string[]>;

type NotificationsState = {
  notifications: AppNotification[];

  activeAccountType: NotificationAccountType;

  readNotificationIds: ReadNotificationsMap;

  setActiveAccountType: (accountType: NotificationAccountType) => void;

  markOneAsRead: (notificationId: string) => void;

  markAllAsRead: () => void;

  resetNotifications: () => void;
};

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],

      activeAccountType: "personal",

      readNotificationIds: {
        personal: [],
        business: [],
      },

      setActiveAccountType: (accountType) =>
        set({
          activeAccountType: accountType,
        }),

      markOneAsRead: (notificationId) =>
        set((state) => {
          const activeType = state.activeAccountType;

          const alreadyRead =
            state.readNotificationIds[activeType].includes(notificationId);

          if (alreadyRead) {
            return state;
          }

          return {
            readNotificationIds: {
              ...state.readNotificationIds,

              [activeType]: [
                ...state.readNotificationIds[activeType],
                notificationId,
              ],
            },
          };
        }),

      markAllAsRead: () =>
        set((state) => {
          const activeType = state.activeAccountType;

          const accountNotificationIds = state.notifications
            .filter(
              (notification) =>
                notification.recipientAccountType === activeType,
            )
            .map((notification) => notification.id);

          return {
            readNotificationIds: {
              ...state.readNotificationIds,

              [activeType]: accountNotificationIds,
            },
          };
        }),

      resetNotifications: () =>
        set({
          notifications: [],

          readNotificationIds: {
            personal: [],
            business: [],
          },
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
