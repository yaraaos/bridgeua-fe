import { useEffect, useMemo, useState } from "react";

import { useNotificationsStore } from "@/src/store/notifications.store";
import type {
  AppNotification,
  NotificationTab,
} from "../types/notification.types";

function isPromotionNotification(notification: AppNotification) {
  return (
    notification.type === "promotion" ||
    notification.type === "promotion_expiring" ||
    notification.type === "birthday"
  );
}

function isUpdateNotification(notification: AppNotification) {
  return (
    notification.type === "business_update" ||
    notification.type === "new_business" ||
    notification.type === "profile_suggestion" ||
    notification.type === "system_update"
  );
}

function isActivityNotification(notification: AppNotification) {
  return (
    notification.type === "new_follower" ||
    notification.type === "new_review" ||
    notification.type === "recommendation" ||
    notification.type === "recommendation_received" ||
    notification.type === "review_upvote"
  );
}

function matchesTab(notification: AppNotification, activeTab: NotificationTab) {
  if (activeTab === "all") return true;
  if (activeTab === "unread") return !notification.isRead;
  if (activeTab === "activity") return isActivityNotification(notification);
  if (activeTab === "promotions") return isPromotionNotification(notification);
  if (activeTab === "updates") return isUpdateNotification(notification);

  return true;
}

export function useNotifications(activeTab: NotificationTab) {
  const notifications = useNotificationsStore((state) => state.notifications);
  const activeAccountType = useNotificationsStore(
    (state) => state.activeAccountType,
  );
  const readNotificationIds = useNotificationsStore(
    (state) => state.readNotificationIds,
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [activeAccountType, activeTab]);

  return useMemo(() => {
    const activeReadIds = readNotificationIds[activeAccountType] ?? [];

    const accountNotifications = notifications
      .filter(
        (notification) =>
          notification.recipientAccountType === activeAccountType,
      )
      .map((notification) => ({
        ...notification,
        isRead:
          notification.isRead === true ||
          activeReadIds.includes(notification.id),
      }))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    const filteredNotifications = accountNotifications.filter((notification) =>
      matchesTab(notification, activeTab),
    );

    const unreadCount = accountNotifications.filter(
      (notification) => !notification.isRead,
    ).length;

    const newNotifications = filteredNotifications.filter((notification) => {
      const ageMs = Date.now() - new Date(notification.createdAt).getTime();
      return ageMs < 24 * 60 * 60 * 1000;
    });

    const earlierNotifications = filteredNotifications.filter(
      (notification) => {
        const ageMs = Date.now() - new Date(notification.createdAt).getTime();
        return ageMs >= 24 * 60 * 60 * 1000;
      },
    );

    return {
      notifications: filteredNotifications,
      newNotifications,
      earlierNotifications,
      unreadCount,
      activeAccountType,
      isLoading,
    };
  }, [
    activeAccountType,
    activeTab,
    notifications,
    readNotificationIds,
    isLoading,
  ]);
}
