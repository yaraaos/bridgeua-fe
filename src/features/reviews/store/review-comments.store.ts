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
