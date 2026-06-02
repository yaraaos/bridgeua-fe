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
  ownerId?: string | number | null;
  isOwnedByMe?: boolean;
  distanceKm: number | null;
  priceLevel: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isOpen?: boolean;
  closesAt?: string | null;
  opensAt?: string | null;
};
