import type { Business, BusinessDetails } from "@/src/features/businesses/types/business.types";

export type NewsCtaType = "view_business" | "view_menu" | "view_address";

export type NewsItem = {
  id: string;
  businessId: string;

  title: string;
  description: string;
  content: string;
  imageUrl: string;

  categoryLabel?: string;
  publishedAt: string;

  ctaType: NewsCtaType;
  ctaLabel: string;

  business?: Business | BusinessDetails;
};