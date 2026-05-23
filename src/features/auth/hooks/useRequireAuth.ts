import { router } from "expo-router";

import { useAuthStore } from "@/src/store/auth.store";

type ProtectedAction =
  | "follow"
  | "book"
  | "review"
  | "comment"
  | "promotion"
  | "notification"
  | "profile"
  | "default";

type RequireAuthOptions = {
  action?: ProtectedAction;
  redirectTo?: string;
};

export function useRequireAuth() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isGuest = useAuthStore((state) => state.isGuest);

  const canAccessProtectedAction = isAuthenticated && !isGuest;

  const requireAuth = (
    callback: () => void,
    options: RequireAuthOptions = {},
  ) => {
    if (canAccessProtectedAction) {
      callback();
      return;
    }

    router.push({
      pathname: "/auth/sign-in",
      params: {
        reason: options.action ?? "default",
        redirectTo: options.redirectTo,
      },
    });
  };

  return {
    isAuthenticated,
    isGuest,
    canAccessProtectedAction,
    requireAuth,
  };
}
