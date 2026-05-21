import { create } from "zustand";

import type { AuthUser } from "../features/auth/types/auth.types";
import { apiClient } from "../services/api/client";
import { ENDPOINTS } from "../services/api/endpoints";
import { getAuthSession } from "../services/auth/session";
import { clearAuthTokens } from "../services/auth/tokens";
import { useFollowingStore } from "./following.store";
import { useProfileStore } from "./profile.store";
import { useReviewsStore } from "./reviews.store";

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: AuthUser) => void;
  clearUser: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearUser: async () => {
    await clearAuthTokens();

    useFollowingStore.getState().resetFollowing();
    useReviewsStore.getState().clearReviews();
    useProfileStore.getState().clearProfile();

    set({
      user: null,
      isAuthenticated: false,
    });
  },

  hydrate: async () => {
    try {
      const session = await getAuthSession();

      if (!session) {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });

        return;
      }

      const res = await apiClient.get<AuthUser>(ENDPOINTS.AUTH_ME);

      set({
        user: res.data,
        isAuthenticated: true,
        isLoading: false,
      });

      await useProfileStore.getState().loadProfile();
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
