import type { Business } from "@/src/types/business";
import { useEffect, useState } from "react";
import { getBusinesses } from "../services/business.service";

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
