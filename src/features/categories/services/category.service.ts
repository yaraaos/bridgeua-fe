import { apiClient } from "@/src/services/api/client";
import { ENDPOINTS } from "@/src/services/api/endpoints";

export type Category = {
  id: number;
  name: string;
  slug: string;
};

export const getCategories = async (): Promise<Category[]> => {
  const res = await apiClient.get<Category[]>(ENDPOINTS.CATEGORIES);
  return res.data;
};
