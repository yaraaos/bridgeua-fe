export type NotificationAccountType = "personal" | "business";

export type NotificationType =
  | "business_update"
  | "birthday"
  | "new_business"
  | "new_follower"
  | "new_review"
  | "profile_suggestion"
  | "promotion"
  | "promotion_expiring"
  | "recommendation"
  | "recommendation_received"
  | "review_upvote"
  | "system_update";

export type NotificationTargetType =
  | "business"
  | "profile"
  | "promotion"
  | "review"
  | "settings";

export type NotificationTab =
  | "all"
  | "unread"
  | "activity"
  | "promotions"
  | "updates";

export type AppNotification = {
  id: string;
  recipientAccountType: NotificationAccountType;
  type: NotificationType;
  title: string;
  subtitle: string;
  createdAt: string;
  isRead: boolean;
  imageUrl?: string;
  targetId?: string;
  targetType?: NotificationTargetType;
};