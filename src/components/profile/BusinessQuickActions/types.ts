export type QuickActionId =
  | "add-promo"
  | "add-news"
  | "edit-business"
  | "edit-services"
  | "edit-gallery"
  | "view-bookings"
  | "view-reviews"
  | "share-business"
  | "view-public-profile"
  | "edit-team"
  | "view-recommends"
  | "view-recommended-by";

export type QuickActionItem = {
  id: QuickActionId;
  label: string;
  icon: string;
};
