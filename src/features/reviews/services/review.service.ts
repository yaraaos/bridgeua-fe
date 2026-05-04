import type {
  GetReviewsParams,
  GetReviewsResponse,
  SubmitReviewPayload,
  Review,
} from "../types/review.types";

import { businessDetailsMock } from "@/src/mocks/business-details.mock";

export const getReviews = async ({
  businessId,
  page = 1,
  limit = 10,
  rating,
}: GetReviewsParams): Promise<GetReviewsResponse> => {
  const business = businessDetailsMock.find((b) => b.id === businessId);

  if (!business) {
    return {
      data: [],
      page: 1,
      totalPages: 1,
    };
  }

  let reviews: Review[] = business.reviews.map((r) => ({
    ...r,
    businessId,
    createdAt: new Date().toISOString(),
    photos: r.photos?.map((p) => p.url),
  }));

  if (rating) {
    reviews = reviews.filter((r) => r.rating === rating);
  }

  const start = (page - 1) * limit;
  const paginated = reviews.slice(start, start + limit);

  return {
    data: paginated,
    page,
    totalPages: Math.ceil(reviews.length / limit),
  };
};

export const submitReview = async (
  payload: SubmitReviewPayload,
): Promise<Review> => {
  // 🔥 mock create
  const newReview: Review = {
    id: `review-${Date.now()}`,
    businessId: payload.businessId,
    authorName: "You",
    authorAvatar: "",
    rating: payload.rating,
    text: payload.text,
    tags: payload.tags,
    photos: payload.photos,
    createdAt: new Date().toISOString(),
  };

  console.log("API POST /reviews", payload);

  return Promise.resolve(newReview);
};