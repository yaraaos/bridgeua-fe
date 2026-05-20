import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { useProfileStore } from "@/src/store/profile.store";
import { useReviewsStore } from "@/src/store/reviews.store";
import { reviewCommentsMock } from "../mocks/review-comments.mock";
import type {
  CreateReviewCommentPayload,
  ReviewComment,
} from "../types/review-comment.types";

type ReviewCommentsState = {
  comments: ReviewComment[];

  getCommentsByReviewId: (reviewId: string) => ReviewComment[];
  addComment: (payload: CreateReviewCommentPayload) => ReviewComment;
  toggleCommentLike: (commentId: string) => void;
  deleteComment: (commentId: string) => void;
};

export const useReviewCommentsStore = create<ReviewCommentsState>()(
  persist(
    (set, get) => ({
      comments: reviewCommentsMock,

      getCommentsByReviewId: (reviewId) =>
        get()
          .comments.filter((comment) => comment.reviewId === reviewId)
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          ),

      addComment: (payload) => {
        const profile = useProfileStore.getState().profile;

        const newComment: ReviewComment = {
          id: `comment-${Date.now()}`,
          reviewId: payload.reviewId,
          parentCommentId: payload.parentCommentId,
          author: {
            id: profile.id,
            name: profile.displayName,
            username: profile.username,
            avatarUrl: profile.avatarUrl,
          },
          text: payload.text,
          likesCount: 0,
          likedByMe: false,
          repliesCount: 0,
          createdAt: new Date().toISOString(),
        };

        console.log("API POST /reviews/:reviewId/comments", payload);

        if (payload.parentCommentId) {
          set((state) => ({
            comments: state.comments.map((comment) =>
              comment.id === payload.parentCommentId
                ? {
                    ...comment,
                    repliesCount: comment.repliesCount + 1,
                  }
                : comment,
            ),
          }));
        } else {
          useReviewsStore.getState().updateReview(payload.reviewId, {
            commentsCount:
              (useReviewsStore
                .getState()
                .submittedReviews.find(
                  (review) => review.id === payload.reviewId,
                )?.commentsCount ?? 0) + 1,
          });
        }

        set((state) => ({
          comments: [...state.comments, newComment],
        }));

        return newComment;
      },
      toggleCommentLike: (commentId) =>
        set((state) => ({
          comments: state.comments.map((comment) => {
            if (comment.id !== commentId) {
              return comment;
            }

            const isLiked = comment.likedByMe ?? false;
            const currentLikesCount = comment.likesCount ?? 0;

            return {
              ...comment,
              likedByMe: !isLiked,
              likesCount: isLiked
                ? Math.max(0, currentLikesCount - 1)
                : currentLikesCount + 1,
            };
          }),
        })),

      deleteComment: (commentId) =>
        set((state) => {
          const commentToDelete = state.comments.find(
            (comment) => comment.id === commentId,
          );

          if (!commentToDelete) {
            return state;
          }

          return {
            comments: state.comments.filter(
              (comment) =>
                comment.id !== commentId &&
                comment.parentCommentId !== commentId,
            ),
          };
        }),
    }),
    {
      name: "review-comments-storage",
      storage: createJSONStorage(() => ({
        getItem: SecureStore.getItemAsync,
        setItem: SecureStore.setItemAsync,
        removeItem: SecureStore.deleteItemAsync,
      })),
    },
  ),
);
