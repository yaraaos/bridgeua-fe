import { apiClient } from "@/src/services/api/client";
import { ENDPOINTS } from "@/src/services/api/endpoints";
import type { ReviewComment } from "../types/review-comment.types";

const mapComment = (raw: {
  id: number;
  reviewId: number;
  parentId: number | null;
  text: string;
  createdAt: string;
  user: { id: number; firstName: string; lastName: string; avatarUrl?: string | null; username?: string | null };
  replies?: unknown[];
  isOwnerReply?: boolean;
}): ReviewComment => ({
  id: String(raw.id),
  reviewId: String(raw.reviewId),
  parentCommentId: raw.parentId ? String(raw.parentId) : undefined,
  author: {
    id: String(raw.user.id),
    name: `${raw.user.firstName} ${raw.user.lastName}`.trim(),
    username: raw.user.username ?? raw.user.firstName?.toLowerCase() ?? "",
    avatarUrl: raw.user.avatarUrl ?? undefined,
  },
  text: raw.text,
  likesCount: 0,
  likedByMe: false,
  repliesCount: raw.replies?.length ?? 0,
  createdAt: raw.createdAt,
  isOwnerReply: raw.isOwnerReply ?? false,
});

export const getComments = async (
  businessId: string,
  reviewId: string,
): Promise<ReviewComment[]> => {
  const res = await apiClient.get<any>(
    ENDPOINTS.REVIEW_COMMENTS(businessId, reviewId),
  );

  const flat: ReviewComment[] = [];
  for (const comment of res.data) {
    flat.push(mapComment(comment));
    for (const reply of comment.replies ?? []) {
      flat.push(mapComment(reply));
    }
  }
  return flat;
};

export const addComment = async (
  businessId: string,
  reviewId: string,
  text: string,
  parentId?: string,
): Promise<ReviewComment> => {
  const res = await apiClient.post<any>(
    ENDPOINTS.REVIEW_COMMENTS(businessId, reviewId),
    { text, parentId: parentId ? Number(parentId) : null },
  );
  return mapComment(res.data);
};

export const deleteComment = async (
  businessId: string,
  reviewId: string,
  commentId: string,
): Promise<void> => {
  await apiClient.delete(
    ENDPOINTS.REVIEW_COMMENT_BY_ID(businessId, reviewId, commentId),
  );
};
