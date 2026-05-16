import { create } from "zustand";

import { notificationsMock } from "@/src/mocks/notifications.mock";
import type {
  AppNotification,
  NotificationAccountType,
} from "@/src/features/notifications/types/notification.types";

type NotificationsState = {
  notifications: AppNotification[];
  activeAccountType: NotificationAccountType;

  setActiveAccountType: (accountType: NotificationAccountType) => void;
  markOneAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  resetNotifications: () => void;
};

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: notificationsMock,
  activeAccountType: "business",

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
}));