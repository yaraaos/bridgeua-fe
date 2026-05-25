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

export const getReviewById = async (
  reviewId: string,
): Promise<Review | null> => {
  const submittedReview = useReviewsStore
    .getState()
    .submittedReviews.find((review) => review.id === reviewId);

  if (submittedReview) {
    return Promise.resolve(submittedReview);
  }

  const mockReview = businessDetailsMock
    .flatMap((business) =>
      business.reviews.map((review) => ({
        ...review,
        businessId: business.id,
      })),
    )
    .find((review) => review.id === reviewId);

  return Promise.resolve(mockReview ?? null);
};

export const getMyReviews = async (): Promise<PersonalProfileReview[]> => {
  const profile = useProfileStore.getState().profile;

  const currentUserNames = [profile.displayName];

  const mockReviews = businessDetailsMock.flatMap((business) =>
    business.reviews
      .filter((review) => currentUserNames.includes(review.authorName))
      .map((review) => ({
        id: review.id,
        businessId: business.id,
        businessName: business.name,
        businessImageUrl: business.images[0]?.url ?? "",
        rating: review.rating,
        likesCount: review.likesCount,
        commentsCount: review.commentsCount,
        likedByMe: review.likedByMe,
        text: review.text,
        createdAt: review.createdAt,
        photos: review.photos,
      })),
  );

  const submittedReviews = useReviewsStore
    .getState()
    .submittedReviews.map((review) => {
      const business = businessDetailsMock.find(
        (item) => item.id === review.businessId,
      );

      return {
        id: review.id,
        businessId: review.businessId,
        businessName: business?.name ?? "Business",
        businessImageUrl: business?.images[0]?.url ?? "",
        rating: review.rating,
        likesCount: review.likesCount,
        commentsCount: review.commentsCount,
        likedByMe: review.likedByMe,
        text: review.text,
        createdAt: review.createdAt,
        photos: review.photos,
      };
    });

  return Promise.resolve([...submittedReviews, ...mockReviews]);
};
