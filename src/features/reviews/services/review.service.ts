import { businessDetailsMock } from "@/src/mocks/business-details.mock";
import type {
  GetReviewsParams,
  GetReviewsResponse,
  Review,
  SubmitReviewPayload,
} from "../types/review.types";

let submittedReviewsMock: Review[] = [];

const EMPTY_BREAKDOWN = ([5, 4, 3, 2, 1] as const).map((rating) => ({
  rating,
  count: 0,
}));

export const getReviews = async ({
  businessId,
  page = 1,
  limit = 10,
  rating,
}: GetReviewsParams): Promise<GetReviewsResponse> => {
  const business = businessDetailsMock.find((item) => item.id === businessId);

  if (!business) {
    return {
      data: [],
      page: 1,
      totalPages: 1,
      total: 0,
      summary: {
        rating: 0,
        reviewCount: 0,
        breakdown: EMPTY_BREAKDOWN,
      },
    };
  }

  const mockReviews: Review[] = business.reviews.map((review) => ({
    ...review,
    businessId,
  }));

  let reviews: Review[] = [
    ...submittedReviewsMock.filter(
      (review) => review.businessId === businessId,
    ),
    ...mockReviews,
  ];

  if (rating) {
    reviews = reviews.filter((review) => review.rating === rating);
  }

  const reviewCount = reviews.length;

  const averageRating =
    reviewCount > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0;

  const breakdown = ([5, 4, 3, 2, 1] as const).map((ratingValue) => ({
    rating: ratingValue,
    count: reviews.filter(
      (review) => Math.round(review.rating) === ratingValue,
    ).length,
  }));

  const start = (page - 1) * limit;
  const paginated = reviews.slice(start, start + limit);
  const totalPages = Math.max(1, Math.ceil(reviews.length / limit));

  return {
    data: paginated,
    page,
    totalPages,
    total: reviews.length,
    summary: {
      rating: averageRating,
      reviewCount,
      breakdown,
    },
  };
};

export const submitReview = async (
  payload: SubmitReviewPayload,
): Promise<Review> => {
  const newReview: Review = {
    id: `review-${Date.now()}`,
    businessId: payload.businessId,
    authorName: "You",
    authorAvatar: "",
    rating: payload.rating,
    text: payload.text,
    tags: payload.tags,
    photos: payload.photos?.map((uri, index) => ({
      id: `submitted-photo-${Date.now()}-${index}`,
      url: uri,
    })),
    createdAt: new Date().toISOString(),
  };

  console.log("API POST /reviews", payload);

  submittedReviewsMock = [newReview, ...submittedReviewsMock];

  return Promise.resolve(newReview);
};