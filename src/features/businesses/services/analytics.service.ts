import { apiClient } from "@/src/services/api/client";
import { ENDPOINTS } from "@/src/services/api/endpoints";

export type AnalyticsStat = { current: number; lastMonth: number };

export type BusinessAnalyticsData = {
  followers: AnalyticsStat;
  bookings: AnalyticsStat;
  newClients: AnalyticsStat;
};

export const fetchBusinessAnalytics = (): Promise<{ data: BusinessAnalyticsData }> =>
  apiClient.get<BusinessAnalyticsData>(ENDPOINTS.BUSINESSES_ME_ANALYTICS);
