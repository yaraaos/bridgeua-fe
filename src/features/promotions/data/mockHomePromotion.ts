import type { HomePromotion } from "../types/promotion.types";

export const mockHomePromotion: HomePromotion = {
  id: "home_promo_001",
  businessId: "1",
  title: "Buy one get one FREE",
  subtitle: "Limited offer",
  description: "Discover this promotion from a trusted local business.",
  imageUrl:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
  businessName: "Lviv Croissant",
  businessCategory: "Cafe",
  ctaLabel: "View Lviv Croissant",
  isActive: true,
};
