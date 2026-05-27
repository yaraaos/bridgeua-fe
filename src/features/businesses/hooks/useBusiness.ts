import type {
  Business,
  BusinessDetails,
} from "@/src/features/businesses/types/business.types";
import { useEffect, useState } from "react";
import {
  getBusinessDetailsById,
  getBusinesses,
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
        setError(e instanceof Error ? e.message : 'Failed to load businesses');
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBusiness = async () => {
      if (!id) {
        setBusiness(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getBusinessDetailsById(id);
        setBusiness(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load business');
      } finally {
        setIsLoading(false);
      }
    };

    loadBusiness();
  }, [id]);

  return { business, isLoading, error };
};
