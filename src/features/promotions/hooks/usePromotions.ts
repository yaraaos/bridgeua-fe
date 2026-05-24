import { useEffect, useState } from "react";
import {
    getActivePromotions,
    getBusinessPromotions,
    getPromotionById,
} from "../services/promotion.service";
import type { Promotion } from "../types/promotion.types";

export function usePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadPromotions() {
      try {
        const data = await getActivePromotions();

        if (isMounted) {
          setPromotions(data);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPromotions();

    return () => {
      isMounted = false;
    };
  }, []);

  return { promotions, isLoading };
}

export function usePromotion(id?: string) {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadPromotion() {
      if (!id) {
        setPromotion(null);
        setIsLoading(false);
        return;
      }

      try {
        const data = await getPromotionById(id);

        if (isMounted) {
          setPromotion(data);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPromotion();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { promotion, isLoading };
}

export function useBusinessPromotions(businessId?: string) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadPromotions() {
      if (!businessId) {
        setPromotions([]);
        setIsLoading(false);
        return;
      }

      try {
        const data = await getBusinessPromotions(businessId);

        if (isMounted) {
          setPromotions(data);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPromotions();

    return () => {
      isMounted = false;
    };
  }, [businessId]);

  return { promotions, isLoading };
}
