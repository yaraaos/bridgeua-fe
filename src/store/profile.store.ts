import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { personalProfileMock } from "@/src/mocks/profile.mock";
import { apiClient } from "@/src/services/api/client";
import { ENDPOINTS } from "@/src/services/api/endpoints";
import type { PersonalProfile } from "@/src/types/profile";

type ProfileState = {
  profile: PersonalProfile;
  setProfile: (profile: PersonalProfile) => void;
  updateProfile: (profile: Partial<PersonalProfile>) => void;
  clearProfile: () => void;
  loadProfile: () => Promise<void>;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: personalProfileMock,

      setProfile: (profile) => set({ profile }),

      updateProfile: (profile) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...profile,
          },
        })),

      clearProfile: () =>
        set({
          profile: personalProfileMock,
        }),

      loadProfile: async () => {
        try {
          const res = await apiClient.get<{
            id: number;
            email: string;
            accountType: string;
            profile: {
              firstName?: string;
              lastName?: string;
              username?: string;
              avatarUrl?: string;
              phoneNumber?: string;
              dateOfBirth?: string;
            } | null;
          }>(ENDPOINTS.USERS_ME);

          const u = res.data;
          const p = u.profile ?? {};
          const displayName =
            [p.firstName, p.lastName].filter(Boolean).join(" ") ||
            p.username ||
            u.email;

          set({
            profile: {
              id: String(u.id),
              email: u.email,
              displayName,
              username: p.username ?? "",
              avatarUrl: p.avatarUrl ?? "",
              firstName: p.firstName,
              lastName: p.lastName,
              phoneNumber: p.phoneNumber,
              dateOfBirth: p.dateOfBirth,
            },
          });
        } catch {
          // Не сбрасываем профиль при ошибке
        }
      },
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => ({
        getItem: SecureStore.getItemAsync,
        setItem: SecureStore.setItemAsync,
        removeItem: SecureStore.deleteItemAsync,
      })),
    },
  ),
);
