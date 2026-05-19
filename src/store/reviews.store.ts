import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Review } from "@/src/features/reviews/types/review.types";

type ReviewsState = {
  submittedReviews: Review[];

  addReview: (review: Review) => void;

  syncReviewAuthorUsername: (payload: {
    previousUsername: string;
    nextUsername: string;
    avatarUrl?: string;
  }) => void;
  clearReviews: () => void;
};

export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set) => ({
      submittedReviews: [],

      addReview: (review) =>
        set((state) => ({
          submittedReviews: [review, ...state.submittedReviews],
        })),

      syncReviewAuthorUsername: ({
        previousUsername,
        nextUsername,
        avatarUrl,
      }) =>
        set((state) => ({
          submittedReviews: state.submittedReviews.map((review) =>
            review.authorUsername === previousUsername
              ? {
                  ...review,
                  authorName: nextUsername,
                  authorUsername: nextUsername,
                  authorAvatar: avatarUrl ?? review.authorAvatar,
                }
              : review,
          ),
        })),

      clearReviews: () =>
        set({
          submittedReviews: [],
        }),
    }),
    {
      name: "reviews-storage",
      storage: createJSONStorage(() => ({
        getItem: SecureStore.getItemAsync,
        setItem: SecureStore.setItemAsync,
        removeItem: SecureStore.deleteItemAsync,
      })),
    },
  ),
);
