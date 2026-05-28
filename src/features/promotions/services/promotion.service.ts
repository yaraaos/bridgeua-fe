import { businessesMock } from "@/src/mocks/businesses.mock";
import { mockBannerPromotions } from "../data/mockBannerPromotions";
import { mockFollowingPromotions } from "../data/mockFollowingPromotions";
import type {
  HomePromotion,
  Promotion,
  PromotionDraft,
} from "../types/promotion.types";

const allPromotions: Promotion[] = [
  ...mockBannerPromotions,
  ...mockFollowingPromotions,
];

let ownerPromotions: Promotion[] = [];

export async function getBannerPromotion(): Promise<HomePromotion | null> {
  // Later BE integration:
  // return api.get("/promotions/banner");

  const activePromotion = mockBannerPromotions.find(
    (promotion) => promotion.isActive,
  );

  return activePromotion ?? null;
}

export async function getBannerPromotions(): Promise<HomePromotion[]> {
  // Later BE integration:
  // return api.get("/promotions/banner");

  return mockBannerPromotions.filter((promotion) => promotion.isActive);
}

export async function getActivePromotions(): Promise<Promotion[]> {
  return allPromotions
    .filter((promotion) => promotion.isActive)
    .map((promotion) => ({
      ...promotion,
      business: businessesMock.find(
        (business) => business.id === promotion.businessId,
      ),
    }));
}

export async function getPromotionById(id: string): Promise<Promotion | null> {
  const promotion = allPromotions.find((item) => item.id === id);

  if (!promotion) {
    return null;
  }

  return {
    ...promotion,
    business: businessesMock.find(
      (business) => business.id === promotion.businessId,
    ),
  };
}

export async function getBusinessPromotions(
  businessId: string,
): Promise<Promotion[]> {
  return allPromotions
    .filter(
      (promotion) => promotion.businessId === businessId && promotion.isActive,
    )
    .map((promotion) => ({
      ...promotion,
      business: businessesMock.find(
        (business) => business.id === promotion.businessId,
      ),
    }));
}

export async function getFollowingPromotions(): Promise<Promotion[]> {
  return mockFollowingPromotions
    .filter((promotion) => promotion.isActive)
    .map((promotion) => ({
      ...promotion,
      business: businessesMock.find(
        (business) => business.id === promotion.businessId,
      ),
    }));
}

export async function getOwnerPromotions(
  businessId: string,
): Promise<Promotion[]> {
  return ownerPromotions
    .filter((promotion) => promotion.businessId === businessId)
    .map((promotion) => ({
      ...promotion,
      business: businessesMock.find((b) => b.id === promotion.businessId),
    }));
}

export async function createPromotion(
  draft: PromotionDraft,
): Promise<Promotion> {
  const id = `${Date.now()}`;
  const promotion: Promotion = {
    ...draft,
    id,
    isActive: draft.status === "published",
  } as Promotion;

  ownerPromotions.push(promotion);

  return {
    ...promotion,
    business: businessesMock.find((b) => b.id === promotion.businessId),
  };
}

export async function updatePromotion(
  id: string,
  draft: PromotionDraft,
): Promise<Promotion> {
  const idx = ownerPromotions.findIndex((p) => p.id === id);

  if (idx === -1) {
    throw new Error("Promotion not found");
  }

  const updated: Promotion = {
    ...ownerPromotions[idx],
    ...draft,
    id,
    isActive: draft.status === "published",
  } as Promotion;

  ownerPromotions[idx] = updated;

  return {
    ...updated,
    business: businessesMock.find((b) => b.id === updated.businessId),
  };
}

export async function publishPromotion(id: string): Promise<Promotion> {
  const idx = ownerPromotions.findIndex((p) => p.id === id);

  if (idx === -1) {
    throw new Error("Promotion not found");
  }

  ownerPromotions[idx] = {
    ...ownerPromotions[idx],
    status: "published",
    isActive: true,
  } as Promotion;

  const updated = ownerPromotions[idx];

  return {
    ...updated,
    business: businessesMock.find((b) => b.id === updated.businessId),
  };
}

export async function unpublishPromotion(id: string): Promise<Promotion> {
  const idx = ownerPromotions.findIndex((p) => p.id === id);

  if (idx === -1) {
    throw new Error("Promotion not found");
  }

  ownerPromotions[idx] = {
    ...ownerPromotions[idx],
    status: "unpublished",
    isActive: false,
  } as Promotion;

  const updated = ownerPromotions[idx];

  return {
    ...updated,
    business: businessesMock.find((b) => b.id === updated.businessId),
  };
}
