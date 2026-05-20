import { businessDetailsMock } from "@/src/mocks/business-details.mock";
import { useProfileStore } from "@/src/store/profile.store";
import { useReviewsStore } from "@/src/store/reviews.store";
import { PersonalProfileReview } from "@/src/types/profile";
import type {
  GetReviewsParams,
  GetReviewsResponse,
  Review,
  SubmitReviewPayload,
  UpdateReviewPayload,
} from "../types/review.types";

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
    ...useReviewsStore
      .getState()
      .submittedReviews.filter((review) => review.businessId === businessId),
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
    count: reviews.filter((review) => Math.round(review.rating) === ratingValue)
      .length,
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
  const profile = useProfileStore.getState().profile;

  const newReview: Review = {
    id: `review-${Date.now()}`,
    businessId: payload.businessId,
    authorName: profile.username,
    authorUsername: profile.username,
    authorAvatar: profile.avatarUrl,
    rating: payload.rating,
    likesCount: 0,
    commentsCount: 0,
    likedByMe: false,
    text: payload.text,
    tags: payload.tags,
    photos: payload.photos?.map((uri, index) => ({
      id: `submitted-photo-${Date.now()}-${index}`,
      url: uri,
    })),
    createdAt: new Date().toISOString(),
  };

  console.log("API POST /reviews", payload);

  useReviewsStore.getState().addReview(newReview);

  return Promise.resolve(newReview);
};

export const updateReview = async (
  payload: UpdateReviewPayload,
): Promise<Review | null> => {
  const review = useReviewsStore
    .getState()
    .submittedReviews.find((item) => item.id === payload.reviewId);

  if (!review) {
    return Promise.resolve(null);
  }

  const updatedReview: Review = {
    ...review,
    rating: payload.rating,
    text: payload.text,
    tags: payload.tags ?? review.tags,
    photos: payload.photos
      ? payload.photos.map((uri, index) => ({
          id: `updated-photo-${Date.now()}-${index}`,
          url: uri,
        }))
      : review.photos,
  };

  console.log("API PATCH /reviews/:reviewId", payload);

  useReviewsStore.getState().updateReview(payload.reviewId, updatedReview);

  return Promise.resolve(updatedReview);
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  console.log("API DELETE /reviews/:reviewId", { reviewId });

  useReviewsStore.getState().deleteReview(reviewId);

  return Promise.resolve();
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
