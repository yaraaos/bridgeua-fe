import type { HomePromotion } from "../types/promotion.types";

export const mockHomePromotions: HomePromotion[] = [
  {
    id: "home_feed_promo_001",
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
  },
  {
    id: "home_feed_promo_002",
    businessId: "2",
    title: "20% off manicure",
    subtitle: "Weekend deal",
    description: "Special offer from Tory Pro Nails.",
    imageUrl:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1200&auto=format&fit=crop",
    businessName: "Tory Pro Nails",
    businessCategory: "Beauty",
    ctaLabel: "View Tory Pro Nails",
    isActive: true,
  },
  {
    id: "home_feed_promo_003",
    businessId: "3",
    title: "Free dessert today",
    subtitle: "Food promo",
    description: "Available today for dine-in customers.",
    imageUrl:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1200&auto=format&fit=crop",
    businessName: "Alysa",
    businessCategory: "Food",
    ctaLabel: "View Alysa",
    isActive: true,
  },
];