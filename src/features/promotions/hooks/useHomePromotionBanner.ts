import { useEffect, useState } from "react";

import { getHomeFeedPromotions } from "../services/promotion.service";
import type { HomePromotion } from "../types/promotion.types";

let hasDismissedHomePromotionBannerThisSession = false;

export function useHomePromotionBanner() {
  const [promotions, setPromotions] = useState<HomePromotion[]>([]);
  const [isVisible, setIsVisible] = useState(
    !hasDismissedHomePromotionBannerThisSession,
  );

  useEffect(() => {
    let isMounted = true;

    async function loadPromotions() {
      const data = await getHomeFeedPromotions();

      if (!isMounted) {
        return;
      }

      setPromotions(data);
    }

    loadPromotions();

    return () => {
      isMounted = false;
    };
  }, []);

  const closeBanner = () => {
    hasDismissedHomePromotionBannerThisSession = true;
    setIsVisible(false);
  };

  return {
    promotions,
    isVisible,
    closeBanner,
  };
}
