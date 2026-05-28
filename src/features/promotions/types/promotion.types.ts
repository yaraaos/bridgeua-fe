import type {
  Business,
  BusinessDetails,
} from "@/src/features/businesses/types/business.types";

export type PromotionCtaType = "book_now" | "view_business";

export type PromotionStatus = "draft" | "published" | "unpublished";

export type Promotion = {
  id: string;
  businessId: string;

  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;

  categoryLabel?: string;

  startsAt?: string;
  expiresAt?: string;
  endsAt?: string;

  isActive: boolean;
  status?: PromotionStatus;

  promoCode?: string;
  discountLabel?: string;
  redemptionType?: "auto_apply" | "show_code" | "manual";
  redemptionInstructions?: string;

  offerDetails?: string[];
  terms?: string[];

  ctaType?: PromotionCtaType;
  ctaLabel?: string;

  business?: Business | BusinessDetails;
};

export type HomePromotion = Promotion & {
  businessName: string;
  businessCategory: string;
};

export type PromotionDraft = Omit<Promotion, "business" | "isActive"> & {
  status: PromotionStatus;
};
