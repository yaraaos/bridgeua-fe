import { useProfileStore } from "@/src/store/profile.store";
import { useState } from "react";

type EditProfilePayload = {
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl?: string;
};

export function useEditProfile() {
  const [isSaving, setIsSaving] = useState(false);
  const updateProfile = useProfileStore((state) => state.updateProfile);

  const saveProfile = async (payload: EditProfilePayload) => {
    try {
      setIsSaving(true);

      // TODO: replace with API PATCH /profile/me
      await new Promise((resolve) => setTimeout(resolve, 600));

      updateProfile({
        displayName: `${payload.firstName} ${payload.lastName}`.trim(),
        firstName: payload.firstName,
        lastName: payload.lastName,
        username: payload.username,
        avatarUrl: payload.avatarUrl,
      });

      return true;
    } catch (error) {
      console.error("Edit profile failed", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveProfile,
    isSaving,
  };
}
