import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { getBannerPromotions } from "../services/promotion.service";
import type { HomePromotion } from "../types/promotion.types";

let hasDismissedBannerPromotionThisSession = false;

export function useBannerPromotions() {
  const [promotions, setPromotions] = useState<HomePromotion[]>([]);
  const [isVisible, setIsVisible] = useState(
    !hasDismissedBannerPromotionThisSession,
  );

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function loadPromotions() {
        try {
          const data = await getBannerPromotions();

          if (!isMounted) {
            return;
          }

          setPromotions(data);
        } catch {
          // banner is non-critical; skip silently
        }
      }

      void loadPromotions();

      return () => {
        isMounted = false;
      };
    }, []),
  );

  const closeBanner = () => {
    hasDismissedBannerPromotionThisSession = true;
    setIsVisible(false);
  };

  return {
    promotions,
    isVisible,
    closeBanner,
  };
}