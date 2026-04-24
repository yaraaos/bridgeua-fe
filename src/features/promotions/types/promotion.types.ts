export type HomePromotion = {
  id: string;
  businessId: string;

  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;

  businessName: string;
  businessCategory: string;

  ctaLabel?: string;

  startsAt?: string;
  endsAt?: string;
  isActive: boolean;
};
