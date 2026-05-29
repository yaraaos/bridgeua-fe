import { apiClient } from "@/src/services/api/client";
import { API_BASE_URL } from "@/src/services/api/config";
import type { Promotion } from "../types/promotion.types";

const normalizePromotion = (p: any): Promotion => ({
  ...p,
  imageUrl: p.imageUrl
    ? p.imageUrl.startsWith("http")
      ? p.imageUrl
      : `${API_BASE_URL}${p.imageUrl}`
    : undefined,
});

export const getActivePromotions = async (): Promise<Promotion[]> => {
  const res = await apiClient.get<{ data: any[] }>("/api/promotions/public");
  return (res.data.data ?? res.data).map(normalizePromotion);
};

export const getBusinessPromotions = async (
  businessId: string,
): Promise<Promotion[]> => {
  const res = await apiClient.get<{ data: any[] }>(`/api/promotions/mine`);
  return (res.data.data ?? res.data).map(normalizePromotion);
};

export const getPromotionById = async (
  id: string,
): Promise<Promotion | null> => {
  const res = await apiClient.get<{ data: any }>(`/api/promotions/${id}`);
  const p = res.data.data ?? res.data;
  return p ? normalizePromotion(p) : null;
};

export const getBannerPromotion = async (
  id?: string,
): Promise<Promotion | null> => {
  if (id) return getPromotionById(id);
  const promotions = await getActivePromotions();
  return promotions[0] ?? null;
};

export const getBannerPromotions = async (): Promise<Promotion[]> => {
  return getActivePromotions();
};
