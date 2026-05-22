import { businessesMock } from "@/src/mocks/businesses.mock";
import type { NewsItem } from "../types/news.types";

const newsMock: NewsItem[] = [
  {
    id: "news-1",
    businessId: "1",
    title: "New menu items available",
    description: "We added seasonal dishes and new lunch options.",
    content:
      "We’re excited to introduce our new seasonal dishes and expanded lunch menu. Come by and try our new favorites.",
    imageUrl: "https://picsum.photos/900/520?news-1",
    categoryLabel: "News",
    publishedAt: "2026-04-18T14:30:00.000Z",
    ctaType: "view_menu",
    ctaLabel: "View Menu",
  },
  {
    id: "news-2",
    businessId: "2",
    title: "We moved to a new location",
    description: "Our store has moved to a larger location nearby.",
    content:
      "We are happy to welcome you to our new location. The space is bigger, brighter, and easier to access.",
    imageUrl: "https://picsum.photos/900/520?news-2",
    categoryLabel: "News",
    publishedAt: "2026-04-19T09:00:00.000Z",
    ctaType: "view_address",
    ctaLabel: "View Address",
  },
];

export async function getNewsById(id: string): Promise<NewsItem | null> {
  const newsItem = newsMock.find((item) => item.id === id);

  if (!newsItem) {
    return null;
  }

  return {
    ...newsItem,
    business: businessesMock.find(
      (business) => business.id === newsItem.businessId,
    ),
  };
}