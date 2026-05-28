export type Business = {
  id: string;
  name: string;
  category: string;
  location: string;
  recommendedByPreview: string[];
  recommendedByCount: number;
  rating: number;
  image: string;
  avatarUrl?: string | null;
  distanceKm: number;
  priceLevel: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};
