export const PROTECTED_ACTIONS = {
  FOLLOW: "follow",
  BOOK: "book",
  REVIEW: "review",
  COMMENT: "comment",
  PROMOTION: "promotion",
  NOTIFICATION: "notification",
  PROFILE: "profile",
  DEFAULT: "default",
} as const;

export type ProtectedAction =
  (typeof PROTECTED_ACTIONS)[keyof typeof PROTECTED_ACTIONS];

export const GUEST_ALLOWED_ROUTES = [
  "/(tabs)/home",
  "/business/[id]",
  "/auth/sign-in",
] as const;