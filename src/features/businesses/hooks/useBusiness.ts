import type {
  Business,
  BusinessDetails,
} from "@/src/features/businesses/types/business.types";
import { useCallback, useEffect, useState } from "react";
import {
  getBusinessDetailsById,
  getBusinesses,
  getMyBusinessProfile,
  type GetBusinessesParams,
} from "../services/business.service";

export const useBusinesses = (params?: GetBusinessesParams) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBusinesses = async () => {
      setIsLoading(true);
      try {
        const data = await getBusinesses(params);
        setBusinesses(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load businesses");
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinesses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return { businesses, isLoading, error };
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

  const loadBusiness = useCallback(async () => {
    try {
      setIsLoading((current) => (business ? current : true));
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
  }, [business]);

  useEffect(() => {
    void loadBusiness();
  }, [loadBusiness]);

  return { business, isLoading, error, refetch: loadBusiness };
};
