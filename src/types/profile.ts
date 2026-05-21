export type ProfileAccountType = "personal" | "business";

export type PersonalProfile = {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;

  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
};

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
  likesCount: number;
  commentsCount: number;
  likedByMe: boolean;
  text: string;
  createdAt: string;
  isEdited?: boolean;
  photos?: {
    id: string;
    url: string;
  }[];
};
