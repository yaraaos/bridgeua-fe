import type { PersonalProfile } from "@/src/types/profile";

export const personalProfileMock: PersonalProfile = {
  id: "user_1",
  accountType: "personal",
  username: "kate1111",
  displayName: "Kateryna Zelenska",
  avatarUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  joinedAt: "2024-04-01T00:00:00.000Z",
  stats: [
    { id: "reviews", label: "Reviews", value: 7 },
    { id: "following", label: "Following", value: 11 },
  ],
  actions: [{ id: "edit", label: "Edit profile", route: "/profile/edit" }],
  reviews: [
    {
      id: "review_1",
      businessId: "business_1",
      businessName: "Zelenska Beauty",
      businessCategory: "Beauty",
      businessLocation: "Beverly Hills / California",
      rating: 5,
      text: "Amazing service, super clean and professional. Will definitely come back!",
      createdAt: "2026-05-01T12:00:00.000Z",
    },
    {
      id: "review_2",
      businessId: "business_2",
      businessName: "Tory Pro Nails",
      businessCategory: "Beauty",
      businessLocation: "Beverly Hills / California",
      rating: 5,
      text: "Loved the attention to detail and the final result.",
      createdAt: "2026-04-24T12:00:00.000Z",
    },
  ],
  accountItems: [
    {
      id: "switch-account",
      title: "Switch account",
      subtitle: "Personal or business profile",
      icon: "swap-horizontal-outline",
      route: "/profile/switch-account",
    },
  ],
};
