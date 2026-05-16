import { create } from "zustand";

import type { AuthUser } from "../features/auth/types/auth.types";
import { getAuthSession } from "../services/auth/session";
import { clearAuthTokens } from "../services/auth/tokens";

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
    });
  },

  clearUser: async () => {
    await clearAuthTokens();

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

      // TODO:
      // Replace with backend /me request later

      set({
        user: {
          id: "user-1",
          email: "test@test.com",
          name: "Test User",
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
