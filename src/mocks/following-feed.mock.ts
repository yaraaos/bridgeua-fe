import { FollowingFeedItem } from "@/src/features/following/types/following.types";

export const followingFeedMock: FollowingFeedItem[] = [
  {
    id: "feed-1",
    businessId: "1",
    type: "promotion",
    title: "Spring nails promo",
    description: "Get 15% off manicure services this week.",
    createdAt: "2026-04-20T10:00:00.000Z",
  },
  {
    id: "feed-2",
    businessId: "2",
    type: "promotion",
    title: "New client offer",
    description: "First appointment gets a special discount this month.",
    createdAt: "2026-04-21T09:00:00.000Z",
  },
  {
    id: "feed-3",
    businessId: "3",
    type: "news",
    title: "New menu items available",
    description: "We added seasonal dishes and new lunch options.",
    createdAt: "2026-04-18T14:30:00.000Z",
  },
  {
    id: "feed-4",
    businessId: "4",
    type: "news",
    title: "Updated working hours",
    description: "We are now open earlier on weekdays.",
    createdAt: "2026-04-19T08:15:00.000Z",
  },
  {
    id: "feed-5",
    businessId: "5",
    type: "promotion",
    title: "Healthy combo special",
    description: "Order our eco lunch combo with a limited-time price.",
    createdAt: "2026-04-17T12:00:00.000Z",
  },
  {
    id: "feed-6",
    businessId: "6",
    type: "news",
    title: "Service expansion",
    description: "We now offer additional diagnostics and quick checkups.",
    createdAt: "2026-04-16T16:45:00.000Z",
  },
];