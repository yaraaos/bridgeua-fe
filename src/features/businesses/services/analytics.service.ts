import { apiClient } from "@/src/services/api/client";

export type AnalyticsStat = { current: number; lastMonth: number };

export type BusinessAnalyticsData = {
  followers: AnalyticsStat;
  bookings: AnalyticsStat;
  newClients: AnalyticsStat;
};

export const fetchBusinessAnalytics = (): Promise<{ data: BusinessAnalyticsData }> =>
  apiClient.get<BusinessAnalyticsData>("/api/businesses/me/analytics");
