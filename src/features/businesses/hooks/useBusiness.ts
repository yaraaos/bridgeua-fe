import type {
  Business,
  BusinessDetails,
} from "@/src/features/businesses/types/business.types";
import { useEffect, useState } from "react";
import {
  getBusinessDetailsById,
  getBusinesses,
} from "../services/business.service";

export const useBusinesses = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const data = await getBusinesses();
        setBusinesses(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinesses();
  }, []);

  return { businesses, isLoading };
};

export const useBusinessDetails = (id?: string) => {
  const [business, setBusiness] = useState<BusinessDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };

    loadBusiness();
  }, [id]);

  return { business, isLoading };
};
