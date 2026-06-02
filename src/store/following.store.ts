import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  fetchFollowedBusinessIds,
  followBusiness as apiFolowBusiness,
  unfollowBusiness as apiUnfollowBusiness,
} from "@/src/features/following/services/following.service";

type FollowingState = {
  followedBusinessIds: string[];
  followBusiness: (businessId: string) => Promise<void>;
  unfollowBusiness: (businessId: string) => Promise<void>;
  toggleFollowBusiness: (businessId: string) => Promise<void>;
  isFollowing: (businessId: string) => boolean;
  syncWithServer: () => Promise<void>;
  resetFollowing: () => void;
};

export const useFollowingStore = create<FollowingState>()(
  persist(
    (set, get) => ({
      followedBusinessIds: [],

      followBusiness: async (businessId) => {
        set((state) => {
          if (state.followedBusinessIds.includes(businessId)) return state;
          return { followedBusinessIds: [...state.followedBusinessIds, businessId] };
        });
        try {
          await apiFolowBusiness(businessId);
        } catch {
          // rollback on error
          set((state) => ({
            followedBusinessIds: state.followedBusinessIds.filter((id) => id !== businessId),
          }));
        }
      },

      unfollowBusiness: async (businessId) => {
        set((state) => ({
          followedBusinessIds: state.followedBusinessIds.filter((id) => id !== businessId),
        }));
        try {
          await apiUnfollowBusiness(businessId);
        } catch {
          // rollback on error
          set((state) => ({
            followedBusinessIds: [...state.followedBusinessIds, businessId],
          }));
        }
      },

      toggleFollowBusiness: async (businessId) => {
        const isFollowing = get().followedBusinessIds.includes(businessId);
        if (isFollowing) {
          await get().unfollowBusiness(businessId);
        } else {
          await get().followBusiness(businessId);
        }
      },

      isFollowing: (businessId) =>
        get().followedBusinessIds.includes(businessId),

      syncWithServer: async () => {
        try {
          const ids = await fetchFollowedBusinessIds();
          set({ followedBusinessIds: ids });
        } catch {
          // keep local state if request fails
        }
      },

      resetFollowing: () => set({ followedBusinessIds: [] }),
    }),
    {
      name: "following-storage",
      storage: createJSONStorage(() => ({
        getItem: SecureStore.getItemAsync,
        setItem: SecureStore.setItemAsync,
        removeItem: SecureStore.deleteItemAsync,
      })),
    },
  ),
);
