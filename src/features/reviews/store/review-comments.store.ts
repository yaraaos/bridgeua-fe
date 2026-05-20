import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { useProfileStore } from "@/src/store/profile.store";
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
