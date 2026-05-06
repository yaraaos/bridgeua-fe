export type { Business } from "@/src/types/business";

export type BusinessContactType =
  | "address"
  | "hours"
  | "phone"
  | "website"
  | "instagram";

export type BusinessOpeningHour = {
  id: string;
  day: string;
  hours: string;
};

export type BusinessContactItem = {
  id: string;
  type: BusinessContactType;
  label: string;
  value: string;
  actionUrl?: string;
};

export type BusinessAboutFeature = {
  id: string;
  label: string;
  icon: "shield" | "leaf" | "heart" | "sparkle";
};

export type BusinessAbout = {
  title?: string;
  description: string;
  openingHours?: BusinessOpeningHour[];
  contacts: BusinessContactItem[];
  features: BusinessAboutFeature[];
};

export type BusinessDetailsReview = {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  text: string;
  tags?: string[];
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
  about: BusinessAbout;
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
