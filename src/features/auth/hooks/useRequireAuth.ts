import { useAuthStore } from "@/src/store/auth.store";
import { router } from "expo-router";
import { useState } from "react";
import type { ProtectedAction } from "../constants/permissions";

type RequireAuthOptions = {
  action?: ProtectedAction;
  redirectTo?: string;
};

export function useRequireAuth() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isGuest = useAuthStore((state) => state.isGuest);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [pendingRedirectTo, setPendingRedirectTo] = useState<
    string | undefined
  >(undefined);

  const canAccessProtectedAction = isAuthenticated && !isGuest;

  const closeAuthModal = () => {
    setIsAuthModalVisible(false);
    setPendingRedirectTo(undefined);
  };

  const confirmAuthModal = () => {
    setIsAuthModalVisible(false);

    router.push({
      pathname: "/auth/sign-in",
      params: {
        redirectTo: pendingRedirectTo,
      },
    });
  };

  const requireAuth = (
    callback: () => void,
    options: RequireAuthOptions = {},
  ) => {
    if (canAccessProtectedAction) {
      callback();
      return;
    }

    setPendingRedirectTo(options.redirectTo);
    setIsAuthModalVisible(true);
  };

  return {
    isAuthenticated,
    isGuest,
    canAccessProtectedAction,
    isAuthModalVisible,
    closeAuthModal,
    confirmAuthModal,
    requireAuth,
  };
}
