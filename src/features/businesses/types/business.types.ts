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

export type BusinessHour = {
  day: number;
  opensAt: string | null;
  closesAt: string | null;
  isClosed: boolean;
};

export type BusinessSocialLinks = {
  website?: string;
  instagram?: string;
  facebook?: string;
  telegram?: string;
  whatsapp?: string;
};

export type BusinessContactItem = {
  id: string;
  type: BusinessContactType;
  label: string;
  value: string;
  actionUrl?: string;
};

export type BusinessAmenity = {
  id: string;
  label: string;
  icon:
    | "wifi"
    | "parking"
    | "ac"
    | "pet"
    | "accessibility"
    | "coffee"
    | "tv"
    | "outdoor";
};

export type BusinessSocialLink = {
  id: string;
  label: string;
  icon:
    | "instagram"
    | "facebook"
    | "telegram"
    | "tiktok"
    | "whatsapp"
    | "website";
  url: string;
};

export type BusinessRecommendation = {
  id: string;
  businessId: string;
  businessName: string;
  businessCategory: string;
  businessLocation?: string;
  businessImageUrl?: string;
  recommendedByPreview?: string[];
  recommendedByCount?: number;
};

export type BusinessAbout = {
  title?: string;
  description: string;
  isOpen?: boolean;
  openingHours?: BusinessOpeningHour[];
  contacts: BusinessContactItem[];
  languages?: string[];
  amenities?: BusinessAmenity[];
  socialLinks?: BusinessSocialLink[];
  recommendedBy?: BusinessRecommendation[];
};

export type BusinessDetailsReview = {
  id: string;
  businessId?: string;
  authorName: string;
  authorUsername?: string;
  authorAvatar: string;
  rating: number;
  likesCount: number;
  commentsCount: number;
  likedByMe: boolean;
  text: string;
  createdAt: string;
  isEdited?: boolean;
  tags?: string[];
  photos?: BusinessReviewPhoto[];
};

export type BusinessDetailsService = {
  id: string;
  serviceId?: string;
  categoryId?: string | null;
  name: string;
  durationMinutes?: number;
  price?: number;
  priceFrom?: string;
  duration?: string;
};

export type BusinessBookingSpecialist = {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviewsCount: number;
  avatarUrl?: string;
  description?: string;
};

export type BusinessBookingTimeSlot = {
  id: string;
  time: string;
  isAvailable: boolean;
};

export type BusinessBookingAvailabilityDay = {
  id: string;
  date: string;
  slots: BusinessBookingTimeSlot[];
};

export type BusinessDetailsImage = {
  id: string;
  url: string;
  isDefault?: boolean;
  sortOrder?: number;
};

export type BusinessDetails = {
  id: string;
  ownerId: string | null;
  name: string;
  category: string;
  location: string;
  address: string;
  zipCode?: string;
  city?: string;
  state?: string;
  phone?: string;
  avatarUrl?: string;
  website: string;
  socialLinks?: BusinessSocialLinks;
  businessHours?: BusinessHour[];
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
  bookingSpecialists?: BusinessBookingSpecialist[];
  bookingAvailability?: BusinessBookingAvailabilityDay[];
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
