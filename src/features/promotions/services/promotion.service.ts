import { businessesMock } from "@/src/mocks/businesses.mock";
import { mockBannerPromotions } from "../data/mockBannerPromotions";
import { mockFollowingPromotions } from "../data/mockFollowingPromotions";
import type { HomePromotion, Promotion } from "../types/promotion.types";

const allPromotions: Promotion[] = [
  ...mockBannerPromotions,
  ...mockFollowingPromotions,
];

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
