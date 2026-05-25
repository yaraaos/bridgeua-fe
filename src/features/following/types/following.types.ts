export type FollowingFeedType = "promotion" | "news";

export type FollowingFeedItem = {
  id: string;
  businessId: string;
  type: FollowingFeedType;
  promotionId?: string;
  newsId?: string;
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
  businessDistanceKm?: number;
  businessPriceLevel?: number;
  distanceKm?: number;
  priceLevel?: number;
  recommendedByPreview: string[];
  recommendedByCount: number;
};
