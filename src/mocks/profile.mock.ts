import type { PersonalProfile } from "@/src/types/profile";

export const personalProfileMock: PersonalProfile = {
  id: "user_1",
  accountType: "personal",
  username: "kate1111",
  displayName: "Kateryna Zelenska",
  avatarUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  stats: [
    { id: "following", label: "Following", value: 11 },
    { id: "reviews", label: "Reviews", value: 7 },
  ],
  followedBusinesses: [
    {
      id: "business_1",
      name: "Zelenska Beauty",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400",
      rating: 4.5,
      category: "Beauty",
      location: "Beverly Hills",
    },
    {
      id: "business_2",
      name: "Tory Pro Nails",
      imageUrl:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400",
      rating: 4.3,
      category: "Beauty",
      location: "Beverly Hills",
    },
    {
      id: "business_3",
      name: "La Pasta House",
      imageUrl:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400",
      rating: 4.7,
      category: "Italian",
      location: "Santa Monica",
    },
    {
      id: "business_4",
      name: "Sushi Zen",
      imageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
      rating: 4.8,
      category: "Japanese",
      location: "Downtown LA",
    },
  ],
  reviews: [
    {
      id: "review_1",
      businessId: "business_4",
      businessName: "Sushi Zen",
      businessImageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
      rating: 4.8,
      text: "Amazing sushi and great atmosphere.",
      createdAtLabel: "2 days ago",
    },
    {
      id: "review_2",
      businessId: "business_3",
      businessName: "La Pasta House",
      businessImageUrl:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400",
      rating: 4.7,
      text: "Authentic Italian flavors, love it!",
      createdAtLabel: "1 week ago",
    },
    {
      id: "review_3",
      businessId: "business_2",
      businessName: "Tory Pro Nails",
      businessImageUrl:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400",
      rating: 4.3,
      text: "Great service and attention to detail.",
      createdAtLabel: "2 weeks ago",
    },
  ],
};