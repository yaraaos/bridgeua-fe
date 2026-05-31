import { apiClient } from "@/src/services/api/client";
import { ENDPOINTS } from "@/src/services/api/endpoints";
import type { PersonalProfileReview } from "@/src/types/profile";
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

export const getMyReviews = async (): Promise<PersonalProfileReview[]> => {
  const res = await apiClient.get<PersonalProfileReview[]>(ENDPOINTS.USERS_ME_REVIEWS);
  return res.data;
};

export const uploadReviewPhoto = async (
  businessId: string,
  reviewId: string,
  photoUri: string
): Promise<void> => {
  const formData = new FormData();
  formData.append('photo', {
    uri: photoUri,
    type: 'image/jpeg',
    name: 'review-photo.jpg',
  } as any);
  await apiClient.post(
    ENDPOINTS.REVIEW_PHOTOS(businessId, reviewId),
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
};

export const likeReview = async (businessId: string, reviewId: string): Promise<void> => {
  await apiClient.post(ENDPOINTS.REVIEW_LIKE(businessId, reviewId));
};

export const unlikeReview = async (businessId: string, reviewId: string): Promise<void> => {
  await apiClient.delete(ENDPOINTS.REVIEW_LIKE(businessId, reviewId));
};
