export type QuickActionId =
  | "add-promo"
  | "add-news"
  | "edit-business"
  | "edit-services"
  | "edit-gallery"
  | "view-bookings"
  | "view-reviews"
  | "share-business"
  | "view-public-profile";

export type QuickActionItem = {
  id: QuickActionId;
  label: string;
  icon: string;
};
