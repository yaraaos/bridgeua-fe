import { mockHomePromotion } from "../data/mockHomePromotion";
import type { HomePromotion } from "../types/promotion.types";

export async function getHomePromotion(): Promise<HomePromotion | null> {
  // Later BE integration:
  // return api.get("/promotions/home");

  if (!mockHomePromotion.isActive) {
    return null;
  }

  return mockHomePromotion;
}
