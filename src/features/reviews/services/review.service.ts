import { businessDetailsMock } from "@/src/mocks/business-details.mock";
import type {
  GetReviewsParams,
  GetReviewsResponse,
  Review,
  SubmitReviewPayload,
} from "../types/review.types";

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
    };
  }

  let reviews: Review[] = business.reviews.map((review) => ({
    ...review,
    businessId,
    createdAt: new Date().toISOString(),
  }));

  if (rating) {
    reviews = reviews.filter((review) => review.rating === rating);
  }

  const start = (page - 1) * limit;
  const paginated = reviews.slice(start, start + limit);
  const totalPages = Math.max(1, Math.ceil(reviews.length / limit));

  return {
    data: paginated,
    page,
    totalPages,
    total: reviews.length,
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

  return Promise.resolve(newReview);
};