import { create } from "zustand";

import type { AuthUser } from "../features/auth/types/auth.types";
import { apiClient } from "../services/api/client";
import { ENDPOINTS } from "../services/api/endpoints";
import {
  clearGuestSession,
  getAuthSession,
  startGuestSession,
} from "../services/auth/session";
import { clearAuthTokens, getRefreshToken } from "../services/auth/tokens";
import { useAccountStore } from "./account.store";
import { useFollowingStore } from "./following.store";
import { useProfileStore } from "./profile.store";
import { useReviewsStore } from "./reviews.store";

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;

  setUser: (user: AuthUser) => void;
  enterGuestMode: () => Promise<void>;
  clearUser: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: true,

  setUser: (user) => {
    void clearGuestSession();

    useAccountStore
      .getState()
      .setActiveAccountKind(user.accountType ?? "personal");

    set({
      user,
      isAuthenticated: true,
      isGuest: false,
      isLoading: false,
    });
  },

  enterGuestMode: async () => {
    await startGuestSession();

    useFollowingStore.getState().resetFollowing();
    useReviewsStore.getState().clearReviews();
    useProfileStore.getState().clearProfile();
    useAccountStore.getState().setActiveAccountKind("personal");
    set({
      user: null,
      isAuthenticated: false,
      isGuest: true,
      isLoading: false,
    });
  },

  clearUser: async () => {
    try {
      const refreshToken = await getRefreshToken();

      if (refreshToken) {
        await apiClient.post(ENDPOINTS.AUTH_LOGOUT, { refreshToken });
      }
    } catch {
      // Ignore logout errors — clear locally regardless
    }

    await clearAuthTokens();
    await clearGuestSession();

    useFollowingStore.getState().resetFollowing();
    useReviewsStore.getState().clearReviews();
    useProfileStore.getState().clearProfile();
    useAccountStore.getState().setActiveAccountKind("personal");
    set({
      user: null,
      isAuthenticated: false,
      isGuest: false,
      isLoading: false,
    });
  },

  hydrate: async () => {
    try {
      const session = await getAuthSession();

      if (!session) {
        set({
          user: null,
          isAuthenticated: false,
          isGuest: false,
          isLoading: false,
        });

        return;
      }

      if (session.type === "guest") {
        set({
          user: null,
          isAuthenticated: false,
          isGuest: true,
          isLoading: false,
        });

        return;
      }

      const res = await apiClient.get<AuthUser>(ENDPOINTS.AUTH_ME);

      useAccountStore
        .getState()
        .setActiveAccountKind(res.data.accountType ?? "personal");

      set({
        user: res.data,
        isAuthenticated: true,
        isGuest: false,
        isLoading: false,
      });

      await useProfileStore.getState().loadProfile();
    } catch {
      await clearAuthTokens();
      await clearGuestSession();

      set({
        user: null,
        isAuthenticated: false,
        isGuest: false,
        isLoading: false,
      });
    }
  },
}));
