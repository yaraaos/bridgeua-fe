export type FollowingFeedType = "promotion" | "news";

export type FollowingFeedItem = {
  id: string;
  businessId: string;
  type: FollowingFeedType;
  title: string;
  description: string;
  createdAt: string;
};

export type FollowingFeedCardItem = FollowingFeedItem & {
  businessName: string;
  businessCategory: string;
  businessLocation: string;
  businessImage: string;
  businessRating: number;
  recommendedBy?: string;
};