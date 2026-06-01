import { create } from "zustand";
import { Alert } from 'react-native';

import { useProfileStore } from "@/src/store/profile.store";
import { useReviewsStore } from "@/src/store/reviews.store";
import * as reviewCommentService from "../services/reviewComment.service";
import type {
  CreateReviewCommentPayload,
  ReviewComment,
} from "../types/review-comment.types";

type ReviewCommentsState = {
  comments: ReviewComment[];

  getCommentsByReviewId: (reviewId: string) => ReviewComment[];
  loadComments: (businessId: string, reviewId: string) => Promise<void>;
  addComment: (payload: CreateReviewCommentPayload) => Promise<ReviewComment | null>;
  toggleCommentLike: (commentId: string) => void;
  deleteComment: (businessId: string, reviewId: string, commentId: string) => Promise<void>;
};

export const useReviewCommentsStore = create<ReviewCommentsState>()(
  (set, get) => ({
      comments: [],

      getCommentsByReviewId: (reviewId) =>
        get()
          .comments.filter((comment) => comment.reviewId === reviewId)
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          ),

      loadComments: async (businessId, reviewId) => {
        try {
          const fetched = await reviewCommentService.getComments(businessId, reviewId);
          set((state) => ({
            comments: [
              ...state.comments.filter((c) => c.reviewId !== reviewId),
              ...fetched,
            ],
          }));
        } catch {
          // keep existing comments on error
        }
      },

      addComment: async (payload) => {
        const profile = useProfileStore.getState().profile;

        // Optimistic comment
        const optimisticId = `optimistic-${Date.now()}`;
        const optimistic: ReviewComment = {
          id: optimisticId,
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
          isOwnerReply: false,
        };

        set((state) => ({ comments: [...state.comments, optimistic] }));

        if (payload.parentCommentId) {
          set((state) => ({
            comments: state.comments.map((c) =>
              c.id === payload.parentCommentId
                ? { ...c, repliesCount: c.repliesCount + 1 }
                : c,
            ),
          }));
        }

        useReviewsStore.getState().updateReview(payload.reviewId, {
          commentsCount:
            (useReviewsStore
              .getState()
              .submittedReviews.find((r) => r.id === payload.reviewId)
              ?.commentsCount ?? 0) + 1,
        });

        try {
          const real = await reviewCommentService.addComment(
            payload.businessId,
            payload.reviewId,
            payload.text,
            payload.parentCommentId,
          );
          // Replace optimistic with real
          set((state) => ({
            comments: state.comments.map((c) =>
              c.id === optimisticId ? real : c,
            ),
          }));
          return real;
        } catch (err: any) {
          if (err?.message === 'Business accounts cannot post comments') {
            Alert.alert('Not available', 'Business profiles cannot leave comments.', [{ text: 'OK' }]);
          }
          // Remove optimistic on failure
          set((state) => ({
            comments: state.comments.filter((c) => c.id !== optimisticId),
          }));
          // Rollback commentsCount
          useReviewsStore.getState().updateReview(payload.reviewId, {
            commentsCount: Math.max(
              0,
              (useReviewsStore
                .getState()
                .submittedReviews.find((r) => r.id === payload.reviewId)
                ?.commentsCount ?? 1) - 1,
            ),
          });
          if (payload.parentCommentId) {
            set((state) => ({
              comments: state.comments.map((c) =>
                c.id === payload.parentCommentId
                  ? { ...c, repliesCount: Math.max(0, c.repliesCount - 1) }
                  : c,
              ),
            }));
          }
          return null;
        }
      },

      toggleCommentLike: (commentId) =>
        set((state) => ({
          comments: state.comments.map((comment) => {
            if (comment.id !== commentId) return comment;
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

      deleteComment: async (businessId, reviewId, commentId) => {
        const state = get();
        const commentToDelete = state.comments.find((c) => c.id === commentId);
        if (!commentToDelete) return;

        const deletedRepliesCount = state.comments.filter(
          (c) => c.parentCommentId === commentId,
        ).length;

        // Optimistic delete
        set((s) => ({
          comments: s.comments.filter(
            (c) => c.id !== commentId && c.parentCommentId !== commentId,
          ),
        }));

        useReviewsStore.getState().updateReview(reviewId, {
          commentsCount: Math.max(
            0,
            (useReviewsStore
              .getState()
              .submittedReviews.find((r) => r.id === reviewId)
              ?.commentsCount ?? 0) -
              1 -
              deletedRepliesCount,
          ),
        });

        try {
          await reviewCommentService.deleteComment(businessId, reviewId, commentId);
        } catch {
          // Reload comments on failure to restore state
          await get().loadComments(businessId, reviewId);
        }
      },
    }),
);
