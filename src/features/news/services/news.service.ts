import { apiClient } from "@/src/services/api/client";
import { API_BASE_URL } from "@/src/services/api/config";
import type { NewsItem } from "../types/news.types";

const normalizeNews = (n: any): NewsItem => ({
  ...n,
  imageUrl: n.imageUrl
    ? n.imageUrl.startsWith("http")
      ? n.imageUrl
      : `${API_BASE_URL}${n.imageUrl}`
    : undefined,
});

export const getNewsById = async (id: string): Promise<NewsItem | null> => {
  const res = await apiClient.get<{ data: any }>(`/api/news/${id}`);
  const n = res.data.data ?? res.data;
  return n ? normalizeNews(n) : null;
};

export const getPublicNews = async (state?: string): Promise<NewsItem[]> => {
  const url = state ? `/api/news/public?state=${encodeURIComponent(state)}` : "/api/news/public";
  const res = await apiClient.get<{ data: any[] }>(url);
  return (res.data.data ?? res.data).map(normalizeNews);
};
