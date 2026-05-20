import type {
  BusinessRatingBreakdownItem,
  BusinessReviewPhoto,
} from "@/src/features/businesses/types/business.types";

export type Review = {
  id: string;
  businessId: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  likesCount: number;
  commentsCount: number;
  likedByMe: boolean;
  text: string;
  tags?: string[];
  photos?: BusinessReviewPhoto[];
  createdAt: string;
  authorUsername?: string;
};

export type GetReviewsParams = {
  businessId: string;
  page?: number;
  limit?: number;
  rating?: number;
};

export type GetReviewsResponse = {
  data: Review[];
  page: number;
  totalPages: number;
  total: number;
  summary: ReviewsSummary;
};

export type SubmitReviewPayload = {
  businessId: string;
  rating: number;
  text: string;
  tags?: string[];
  photos?: string[];
};

export type UpdateReviewPayload = {
  reviewId: string;
  rating: number;
  text: string;
  tags?: string[];
  photos?: string[];
};

export type ReviewsSummary = {
  rating: number;
  reviewCount: number;
  breakdown: BusinessRatingBreakdownItem[];
};
