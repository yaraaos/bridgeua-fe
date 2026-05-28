import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type RecommendationsState = {
  recommendedBusinessIds: string[];
  addRecommendation: (businessId: string) => void;
  removeRecommendation: (businessId: string) => void;
  setRecommendations: (ids: string[]) => void;
  isRecommended: (businessId: string) => boolean;
};

export const useRecommendationsStore = create<RecommendationsState>()(
  persist(
    (set, get) => ({
      recommendedBusinessIds: [],
      addRecommendation: (businessId) => {
        set((state) => {
          if (state.recommendedBusinessIds.includes(businessId)) return state;
          return {
            recommendedBusinessIds: [
              ...state.recommendedBusinessIds,
              businessId,
            ],
          };
        });
      },
      removeRecommendation: (businessId) => {
        set((state) => ({
          recommendedBusinessIds: state.recommendedBusinessIds.filter(
            (id) => id !== businessId,
          ),
        }));
      },
      setRecommendations: (ids) => {
        set({ recommendedBusinessIds: ids });
      },
      isRecommended: (businessId) =>
        get().recommendedBusinessIds.includes(businessId),
    }),
    {
      name: "recommendations-storage",
      storage: createJSONStorage(() => ({
        getItem: SecureStore.getItemAsync,
        setItem: SecureStore.setItemAsync,
        removeItem: SecureStore.deleteItemAsync,
      })),
    },
  ),
);
