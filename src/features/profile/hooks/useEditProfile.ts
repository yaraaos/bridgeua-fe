import { apiClient } from "@/src/services/api/client";
import { ENDPOINTS } from "@/src/services/api/endpoints";
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

      // Если аватар изменился и это локальный URI (с телефона) — загружаем отдельно
      let finalAvatarUrl = payload.avatarUrl;
      if (payload.avatarUrl && payload.avatarUrl !== profile.avatarUrl && payload.avatarUrl.startsWith('file')) {
        const formData = new FormData();
        formData.append('avatar', {
          uri: payload.avatarUrl,
          name: 'avatar.jpg',
          type: 'image/jpeg',
        } as unknown as Blob);

        const avatarRes = await apiClient.post<{ avatarUrl: string }>(
          ENDPOINTS.USERS_ME_AVATAR,
          formData,
        );
        finalAvatarUrl = avatarRes.data.avatarUrl;
      }

      // PATCH основных данных профиля
      await apiClient.patch(ENDPOINTS.USERS_ME, {
        firstName: payload.firstName,
        lastName: payload.lastName,
        username: payload.username,
        ...(payload.phoneNumber ? { phoneNumber: payload.phoneNumber } : {}),
        ...(payload.dateOfBirth ? { dateOfBirth: payload.dateOfBirth } : {}),
      });

      if (profile.username !== payload.username) {
        syncReviewAuthorUsername({
          previousUsername: profile.username,
          nextUsername: payload.username,
          avatarUrl: finalAvatarUrl,
        });
      }

      updateProfile({
        displayName: `${payload.firstName} ${payload.lastName}`.trim(),
        firstName: payload.firstName,
        lastName: payload.lastName,
        username: payload.username,
        phoneNumber: payload.phoneNumber,
        dateOfBirth: payload.dateOfBirth,
        avatarUrl: finalAvatarUrl,
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
