import { useEffect, useState } from "react";

import { getBannerPromotions } from "../services/promotion.service";
import type { HomePromotion } from "../types/promotion.types";

let hasDismissedBannerPromotionThisSession = false;

export function useBannerPromotions() {
  const [promotions, setPromotions] = useState<HomePromotion[]>([]);
  const [isVisible, setIsVisible] = useState(
    !hasDismissedBannerPromotionThisSession,
  );

  useEffect(() => {
    let isMounted = true;

    async function loadPromotions() {
      const data = await getBannerPromotions();

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
    hasDismissedBannerPromotionThisSession = true;
    setIsVisible(false);
  };

  return {
    promotions,
    isVisible,
    closeBanner,
  };
}
