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

export const getPublicNews = async (): Promise<NewsItem[]> => {
  const res = await apiClient.get<{ data: any[] }>("/api/news/public");
  return (res.data.data ?? res.data).map(normalizeNews);
};
