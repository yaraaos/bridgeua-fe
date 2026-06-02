import { useQuery } from "@tanstack/react-query";
import { fetchBusinessAnalytics, type BusinessAnalyticsData } from "../services/analytics.service";

export function useBusinessAnalytics() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["business-analytics"],
    queryFn: fetchBusinessAnalytics,
    staleTime: 0,
  });

  return {
    analytics: data?.data ?? null,
    isLoading,
    error: error ? String(error) : null,
  };
}
