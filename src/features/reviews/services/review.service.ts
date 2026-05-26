import { apiClient } from "@/src/services/api/client";
import { ENDPOINTS } from "@/src/services/api/endpoints";
import type {
  GetReviewsParams,
  GetReviewsResponse,
  Review,
  SubmitReviewPayload,
  UpdateReviewPayload,
} from "../types/review.types";


export const getReviews = async ({
  businessId,
  page = 1,
  limit = 10,
  rating,
}: GetReviewsParams): Promise<GetReviewsResponse> => {
  const params: Record<string, string | number> = { page, limit };
  if (rating) params.rating = rating;

  const res = await apiClient.get<GetReviewsResponse>(
    ENDPOINTS.BUSINESS_REVIEWS(businessId),
    { params },
  );
  return res.data;
};

export const submitReview = async (
  payload: SubmitReviewPayload,
): Promise<Review> => {
  const res = await apiClient.post<Review>(
    ENDPOINTS.BUSINESS_REVIEWS(payload.businessId),
    {
      rating: payload.rating,
      text: payload.text,
      tags: payload.tags,
    },
  );
  return res.data;
};

export const updateReview = async (
  payload: UpdateReviewPayload,
): Promise<Review | null> => {
  const res = await apiClient.patch<Review>(
    ENDPOINTS.REVIEW_BY_ID(payload.businessId ?? "", payload.reviewId),
    {
      rating: payload.rating,
      text: payload.text,
      tags: payload.tags,
    },
  );
  return res.data;
};

export const deleteReview = async (
  reviewId: string,
  businessId: string,
): Promise<void> => {
  await apiClient.delete(ENDPOINTS.REVIEW_BY_ID(businessId, reviewId));
};
