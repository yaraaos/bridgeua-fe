import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Review } from "@/src/features/reviews/types/review.types";

type ReviewsState = {
  submittedReviews: Review[];

  addReview: (review: Review) => void;
  updateReview: (reviewId: string, updates: Partial<Review>) => void;
  deleteReview: (reviewId: string) => void;
  toggleReviewLike: (reviewId: string) => void;

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

      updateReview: (reviewId, updates) =>
        set((state) => ({
          submittedReviews: state.submittedReviews.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  ...updates,
                }
              : review,
          ),
        })),

      deleteReview: (reviewId) =>
        set((state) => ({
          submittedReviews: state.submittedReviews.filter(
            (review) => review.id !== reviewId,
          ),
        })),

      toggleReviewLike: (reviewId) =>
        set((state) => ({
          submittedReviews: state.submittedReviews.map((review) => {
            if (review.id !== reviewId) {
              return review;
            }

            const isLiked = review.likedByMe;

            return {
              ...review,
              likedByMe: !isLiked,
              likesCount: isLiked
                ? Math.max(0, review.likesCount - 1)
                : review.likesCount + 1,
            };
          }),
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
