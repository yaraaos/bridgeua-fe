export type Business = {
  id: string | number;

  name?: string;
  businessName?: string;

  imageUrl?: string;
  businessImage?: string;

  category?: string;
  businessCategory?: string;

  location?: string;
  businessLocation?: string;

  rating?: number;
  businessRating?: number;

  distanceKm?: number;
  priceLevel?: number;

  recommendedBy?: string | string[];
};
