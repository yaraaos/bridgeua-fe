import { create } from "zustand";

type FollowingState = {
  followedBusinessIds: string[];
  followBusiness: (businessId: string) => void;
  unfollowBusiness: (businessId: string) => void;
  toggleFollowBusiness: (businessId: string) => void;
  isFollowing: (businessId: string) => boolean;
  resetFollowing: () => void;
};

export const useFollowingStore = create<FollowingState>((set, get) => ({
  followedBusinessIds: [],

  followBusiness: (businessId) =>
    set((state) => {
      if (state.followedBusinessIds.includes(businessId)) {
        return state;
      }

      return {
        followedBusinessIds: [...state.followedBusinessIds, businessId],
      };
    }),

  unfollowBusiness: (businessId) =>
    set((state) => ({
      followedBusinessIds: state.followedBusinessIds.filter(
        (id) => id !== businessId
      ),
    })),

  toggleFollowBusiness: (businessId) =>
    set((state) => {
      const alreadyFollowing = state.followedBusinessIds.includes(businessId);

      return {
        followedBusinessIds: alreadyFollowing
          ? state.followedBusinessIds.filter((id) => id !== businessId)
          : [...state.followedBusinessIds, businessId],
      };
    }),

  isFollowing: (businessId) => get().followedBusinessIds.includes(businessId),

  resetFollowing: () => set({ followedBusinessIds: [] }),
}));