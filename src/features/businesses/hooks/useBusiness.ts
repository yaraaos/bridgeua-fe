import type {
  Business,
  BusinessDetails,
} from "@/src/features/businesses/types/business.types";
import { useAuthStore } from "@/src/store/auth.store";
import { useCallback, useEffect, useState } from "react";
import {
  getBusinessDetailsById,
  getBusinesses,
  getMyBusinessProfile,
  type GetBusinessesParams,
} from "../services/business.service";

export const useBusinesses = (
  params?: GetBusinessesParams,
  refetchTrigger?: number,
) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadBusinesses = async () => {
      try {
        const data = await getBusinesses(params);
        if (!cancelled) {
          setBusinesses(data);
          setIsInitialLoad(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to load businesses",
          );
          setIsInitialLoad(false);
        }
      }
    };

    void loadBusinesses();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params), refetchTrigger]);

  return { businesses, isLoading: isInitialLoad, error };
};

export const useBusinessDetails = (id?: string) => {
  const [business, setBusiness] = useState<BusinessDetails | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  const loadBusiness = useCallback(async () => {
    if (!id) {
      setBusiness(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await getBusinessDetailsById(id);
      setBusiness(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load business");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadBusiness();
  }, [loadBusiness]);

  return { business, isLoading, error, refetch: loadBusiness };
};

export const useMyBusinessProfile = () => {
  const [business, setBusiness] = useState<BusinessDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isGuest = useAuthStore((state) => state.isGuest);

  const loadBusiness = useCallback(async () => {
    if (!isAuthenticated || isGuest) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading((current) => current);
      setError(null);

      const data = await getMyBusinessProfile();
      setBusiness(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to load business profile",
      );
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isGuest]);

  useEffect(() => {
    void loadBusiness();
  }, [loadBusiness]);

  return { business, isLoading, error, refetch: loadBusiness };
};
