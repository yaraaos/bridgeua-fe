import { useEffect, useState } from "react";
import { getNewsById } from "../services/news.service";
import type { NewsItem } from "../types/news.types";

export function useNewsItem(id?: string) {
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadNewsItem() {
      if (!id) {
        setNewsItem(null);
        setIsLoading(false);
        return;
      }

      try {
        const data = await getNewsById(id);

        if (isMounted) {
          setNewsItem(data);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadNewsItem();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { newsItem, isLoading };
}
