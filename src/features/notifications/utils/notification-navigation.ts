import type { AppNotification } from "../types/notification.types";

export function getNotificationNavigation(notification: AppNotification) {
  if (notification.targetType === "business" && notification.targetId) {
    return {
      pathname: "/business/[id]" as const,
      params: {
        id: notification.targetId,
      },
    };
  }

  if (notification.targetType === "review" && notification.targetId) {
    return {
      pathname: "/business/[id]" as const,
      params: {
        id: notification.targetId,
        tab: "reviews",
      },
    };
  }

  if (notification.targetType === "promotion" && notification.targetId) {
    return {
      pathname: "/promotions/[id]" as const,
      params: {
        id: notification.targetId,
      },
    };
  }

  if (notification.targetType === "profile") {
    return {
      pathname: "/profile/personal" as const,
    };
  }

  if (notification.targetType === "settings") {
    return {
      pathname: "/settings" as const,
    };
  }

  return null;
}
