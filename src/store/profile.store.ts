import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { personalProfileMock } from "@/src/mocks/profile.mock";
import type { PersonalProfile } from "@/src/types/profile";

type ProfileState = {
  profile: PersonalProfile;
  setProfile: (profile: PersonalProfile) => void;
  updateProfile: (profile: Partial<PersonalProfile>) => void;
  clearProfile: () => void;
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
