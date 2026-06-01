import { apiClient } from "@/src/services/api/client";
import { API_BASE_URL } from "@/src/services/api/config";
import type { HomePromotion, Promotion } from "../types/promotion.types";

type PromotionPublicResponse =
  | {
      data?: any[];
      featured?: any[];
    }
  | any[];

const getPromotionArray = (payload: PromotionPublicResponse): any[] => {
  if (Array.isArray(payload)) return payload;
  return payload.data ?? [];
};

const normalizePromotion = (p: any): Promotion => ({
  ...p,
  imageUrl: p.imageUrl
    ? p.imageUrl.startsWith("http")
      ? p.imageUrl
      : `${API_BASE_URL}${p.imageUrl}`
    : undefined,
});

const normalizeHomePromotion = (promotion: any): HomePromotion => {
  const normalized = normalizePromotion(promotion);

  return {
    ...normalized,
    businessName:
      promotion.businessName ?? promotion.business?.name ?? "BridgeUA Business",
    businessCategory:
      promotion.businessCategory ??
      promotion.business?.category?.name ??
      promotion.categoryLabel ??
      "Promotion",
  };
};

export const getActivePromotions = async (state?: string): Promise<Promotion[]> => {
  const url = state ? `/api/promotions/public?state=${encodeURIComponent(state)}` : "/api/promotions/public";
  const res = await apiClient.get<PromotionPublicResponse>(url);
  return getPromotionArray(res.data).map(normalizePromotion);
};

export const getBusinessPromotions = async (
  _businessId: string,
): Promise<Promotion[]> => {
  const res = await apiClient.get<{ data?: any[] } | any[]>(
    "/api/promotions/mine",
  );

  const promotions = Array.isArray(res.data) ? res.data : (res.data.data ?? []);

  return promotions.map(normalizePromotion);
};

export const getPromotionById = async (
  id: string,
): Promise<Promotion | null> => {
  const res = await apiClient.get<{ data?: any } | any>(
    `/api/promotions/${id}`,
  );

  const promotion =
    res.data && typeof res.data === "object" && "data" in res.data
      ? res.data.data
      : res.data;

  return promotion ? normalizePromotion(promotion) : null;
};

export const getBannerPromotion = async (
  id?: string,
): Promise<Promotion | null> => {
  if (id) return getPromotionById(id);

  const promotions = await getBannerPromotions();

  return promotions[0] ?? null;
};

export const getBannerPromotions = async (state?: string): Promise<HomePromotion[]> => {
  const url = state ? `/api/promotions/public?state=${encodeURIComponent(state)}` : "/api/promotions/public";
  const res = await apiClient.get<PromotionPublicResponse>(url);
  const promotions = Array.isArray(res.data) ? res.data : (res.data.featured ?? res.data.data ?? []);
  return promotions.filter((p) => p.isFeatured === true).map(normalizeHomePromotion);
};
