export type { Business } from "@/src/types/business";

export type BusinessDetailsReview = {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  text: string;
  photos?: BusinessReviewPhoto[];
};

export type BusinessDetailsService = {
  id: string;
  name: string;
  priceFrom?: string;
  duration?: string;
};

export type BusinessDetailsImage = {
  id: string;
  url: string;
};

export type BusinessDetails = {
  id: string;
  name: string;
  category: string;
  location: string;
  address: string;
  website: string;
  rating: number;
  reviewCount: number;
  recommendedByCount: number;
  recommendedByPreview: string[];
  images: BusinessDetailsImage[];
  isOpen: boolean;
  closesAt: string;
  isFollowing?: boolean;
  services: BusinessDetailsService[];
  topReviews: BusinessDetailsReview[];
  reviews: BusinessDetailsReview[];
  ratingBreakdown: BusinessRatingBreakdownItem[];
  reviewPhotos: BusinessReviewPhoto[];
};

export type BusinessRatingBreakdownItem = {
  rating: 5 | 4 | 3 | 2 | 1;
  count: number;
};

export type BusinessReviewPhoto = {
  id: string;
  url: string;
};
