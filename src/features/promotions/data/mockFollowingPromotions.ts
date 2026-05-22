import type { Promotion } from "../types/promotion.types";

export const mockFollowingPromotions: Promotion[] = [
  {
    id: "following_promo_001",
    businessId: "1",
    title: "Coffee morning deal",
    subtitle: "For followers",
    description: "Get a special breakfast combo from Lviv Croissant.",
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
    categoryLabel: "Promotions",
    isActive: true,
    expiresAt: "2026-08-31T23:59:59.000Z",
    promoCode: "BRIDGE20",
    discountLabel: "20% off",
    redemptionType: "auto_apply",
    redemptionInstructions:
      "This promo will be applied automatically when you book.",
    offerDetails: [
      "Breakfast combo includes coffee and one croissant.",
      "Available for dine-in and takeaway.",
      "Valid while the promotion is active.",
    ],
    ctaLabel: "Book Now",
    ctaType: "book_now",
  },
  {
    id: "following_promo_002",
    businessId: "2",
    title: "20% off manicure",
    subtitle: "Follower weekend deal",
    description: "Special offer from Tory Pro Nails for followers.",
    imageUrl:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1200&auto=format&fit=crop",
    categoryLabel: "Promotions",
    isActive: true,
    expiresAt: "2026-09-15T23:59:59.000Z",
    offerDetails: [
      "Enjoy 20% off your first manicure.",
      "Appointment booking required.",
      "Valid for selected manicure services.",
    ],
    ctaLabel: "Book Now",
    ctaType: "book_now",
  },
];
