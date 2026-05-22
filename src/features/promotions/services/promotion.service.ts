import { businessesMock } from "@/src/mocks/businesses.mock";
import { mockHomePromotions } from "../data/mockHomePromotions";
import type { HomePromotion, Promotion } from "../types/promotion.types";

export async function getHomePromotion(): Promise<HomePromotion | null> {
  // Later BE integration:
  // return api.get("/promotions/home");

  const activePromotion = mockHomePromotions.find(
    (promotion) => promotion.isActive,
  );

  return activePromotion ?? null;
}

export async function getHomeFeedPromotions(): Promise<HomePromotion[]> {
  // Later BE integration:
  // return api.get("/promotions/home-feed");

  return mockHomePromotions.filter((promotion) => promotion.isActive);
}

export async function getActivePromotions(): Promise<Promotion[]> {
  return mockHomePromotions
    .filter((promotion) => promotion.isActive)
    .map((promotion) => ({
      ...promotion,
      business: businessesMock.find(
        (business) => business.id === promotion.businessId,
      ),
    }));
}

export async function getPromotionById(id: string): Promise<Promotion | null> {
  const promotion = mockHomePromotions.find((item) => item.id === id);

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
  return mockHomePromotions
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
