import { useEffect, useState } from "react";

import { getHomePromotion } from "../services/promotion.service";
import type { HomePromotion } from "../types/promotion.types";

let hasShownHomePromotionThisSession = false;

export function useHomePromotion() {
  const [promotion, setPromotion] = useState<HomePromotion | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPromotion() {
      if (hasShownHomePromotionThisSession) {
        return;
      }

      const data = await getHomePromotion();

      if (!isMounted || !data) {
        return;
      }

      setPromotion(data);
      setIsVisible(true);
      hasShownHomePromotionThisSession = true;
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
