import type { Href } from "expo-router";

export type ProfileAccountType = "personal" | "business";

export type PersonalProfileStat = {
  id: string;
  label: string;
  value: number;
};

export type PersonalProfileAction = {
  id: string;
  label: string;
  route: Href;
};

export type PersonalProfileReview = {
  id: string;
  businessId: string;
  businessName: string;
  businessCategory: string;
  businessLocation: string;
  rating: number;
  text: string;
  createdAt: string;
};

export type PersonalProfile = {
  id: string;
  accountType: "personal";
  username: string;
  displayName: string;
  avatarUrl?: string;
  joinedAt: string;
  stats: PersonalProfileStat[];
  actions: PersonalProfileAction[];
  reviews: PersonalProfileReview[];
};
