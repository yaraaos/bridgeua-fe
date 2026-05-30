import { create } from "zustand";

import type { AuthUser } from "../features/auth/types/auth.types";
import { apiClient } from "../services/api/client";
import { ENDPOINTS } from "../services/api/endpoints";
import {
  clearGuestSession,
  getAuthSession,
  startGuestSession,
} from "../services/auth/session";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
} from "../services/auth/tokens";
import { useAccountStore } from "./account.store";
import { useFollowingStore } from "./following.store";
import { useProfileStore } from "./profile.store";
import { useReviewsStore } from "./reviews.store";

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;

  setUser: (user: AuthUser, tokens?: AuthTokens) => void;
  switchToAccount: (accountId: string) => Promise<void>;
  enterGuestMode: () => Promise<void>;
  clearUser: () => Promise<void>;
  hydrate: () => Promise<void>;
};

const clearAccountScopedState = () => {
  useFollowingStore.getState().resetFollowing();
  useReviewsStore.getState().clearReviews();
  useProfileStore.getState().clearProfile();
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: true,

  setUser: (user, tokens) => {
    void clearGuestSession();

    set({
      user,
      isAuthenticated: true,
      isGuest: false,
      isLoading: false,
    });

    if (tokens && user.id) {
      void (async () => {
        await saveAuthTokens(tokens.accessToken, tokens.refreshToken);

        await useAccountStore.getState().addAccount({
          userId: String(user.id),
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });

        await useAccountStore.getState().setActiveAccountId(String(user.id));
      })();
    } else {
      void useAccountStore
        .getState()
        .setActiveAccountKind(user.accountType ?? "personal");
    }
  },

  switchToAccount: async (accountId) => {
    set({ isLoading: true });

    try {
      await useAccountStore.getState().setActiveAccountId(accountId);

      clearAccountScopedState();

      const res = await apiClient.get<AuthUser>(ENDPOINTS.AUTH_ME);

      set({
        user: res.data,
        isAuthenticated: true,
        isGuest: false,
        isLoading: false,
      });

      await useProfileStore.getState().loadProfile();
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isGuest: false,
        isLoading: false,
      });

      throw new Error("Failed to switch account");
    }
  },

  enterGuestMode: async () => {
    await startGuestSession();

    clearAccountScopedState();

    await useAccountStore.getState().setActiveAccountKind("personal");

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

    clearAccountScopedState();

    await useAccountStore.getState().setActiveAccountKind("personal");

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

      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();

      if (accessToken && refreshToken && res.data.id) {
        await useAccountStore.getState().addAccount({
          userId: String(res.data.id),
          accessToken,
          refreshToken,
        });

        await useAccountStore
          .getState()
          .setActiveAccountId(String(res.data.id));
      } else {
        await useAccountStore
          .getState()
          .setActiveAccountKind(res.data.accountType ?? "personal");
      }

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
