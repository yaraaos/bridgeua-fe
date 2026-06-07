import { useEffect, useState } from "react";

import { getBannerPromotion } from "../services/promotion.service";
import type { HomePromotion } from "../types/promotion.types";

let hasShownBannerPromotionThisSession = false;

export function useBannerPromotion() {
  const [promotion, setPromotion] = useState<HomePromotion | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPromotion() {
      if (hasShownBannerPromotionThisSession) {
        return;
      }

      try {
        const data = await getBannerPromotion();

        if (!isMounted || !data) {
          return;
        }

        setPromotion(data);
        setIsVisible(true);
        hasShownBannerPromotionThisSession = true;
      } catch {
        // banner is non-critical; skip silently
      }
    }

    loadPromotion();

    return () => {
      isMounted = false;
    };
  }, []);

  const closePromotion = () => {
    setIsVisible(false);
  };

  return {
    promotion,
    isVisible,
    closePromotion,
  };
}