import { useProfileStore } from "@/src/store/profile.store";
import { useReviewsStore } from "@/src/store/reviews.store";
import { useState } from "react";

type EditProfilePayload = {
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
};

export function useEditProfile() {
  const [isSaving, setIsSaving] = useState(false);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const profile = useProfileStore((state) => state.profile);
  const syncReviewAuthorUsername = useReviewsStore(
    (state) => state.syncReviewAuthorUsername,
  );

  const saveProfile = async (payload: EditProfilePayload) => {
    try {
      setIsSaving(true);

      // TODO: replace with API PATCH /profile/me
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (profile.username !== payload.username) {
        syncReviewAuthorUsername({
          previousUsername: profile.username,
          nextUsername: payload.username,
          avatarUrl: payload.avatarUrl,
        });
      }

      updateProfile({
        displayName: `${payload.firstName} ${payload.lastName}`.trim(),
        firstName: payload.firstName,
        lastName: payload.lastName,
        username: payload.username,
        phoneNumber: payload.phoneNumber,
        dateOfBirth: payload.dateOfBirth,
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
