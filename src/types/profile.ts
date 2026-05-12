export type ProfileAccountType = "personal" | "business";

export type PersonalProfileStat = {
  id: "following" | "reviews";
  label: string;
  value: number;
};

export type PersonalProfileFollowedBusiness = {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  category: string;
  location: string;
};

export type PersonalProfileReview = {
  id: string;
  businessId: string;
  businessName: string;
  businessImageUrl: string;
  rating: number;
  text: string;
  createdAtLabel: string;
};

export type PersonalProfile = {
  id: string;
  accountType: "personal";
  username: string;
  displayName: string;
  avatarUrl?: string;
  stats: PersonalProfileStat[];
  followedBusinesses: PersonalProfileFollowedBusiness[];
  reviews: PersonalProfileReview[];
};