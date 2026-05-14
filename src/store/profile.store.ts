import { create } from "zustand";

import { personalProfileMock } from "@/src/mocks/profile.mock";
import type { PersonalProfile } from "@/src/types/profile";

type ProfileState = {
  profile: PersonalProfile;
  updateProfile: (profile: Partial<PersonalProfile>) => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: personalProfileMock,

  updateProfile: (profile) =>
    set((state) => ({
      profile: {
        ...state.profile,
        ...profile,
      },
    })),
}));
