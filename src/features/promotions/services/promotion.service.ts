import { mockHomePromotions } from "../data/mockHomePromotions";
import type { HomePromotion } from "../types/promotion.types";

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
