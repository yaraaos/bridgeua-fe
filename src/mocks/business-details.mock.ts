import type { BusinessDetails } from "@/src/features/businesses/types/business.types";

export const businessDetailsMock: BusinessDetails[] = [
  {
    id: "1",
    name: "Zelenska Beauty",
    category: "Beauty",
    location: "Beverly Hills / California",
    address: "9455 S Santa Monica Blvd, Beverly Hills, CA 90210, United States",
    website: "zelenskabeauty.com",
    rating: 4.5,
    reviewCount: 28,
    recommendedByCount: 5,
    recommendedByPreview: ["ToryProNails", "Best deal"],
    isOpen: true,
    closesAt: "21:00",
    images: [
      {
        id: "zelenska-main",
        url: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=1200",
      },
      {
        id: "zelenska-service",
        url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900",
      },
      {
        id: "zelenska-interior",
        url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900",
      },
    ],
    services: [
      {
        id: "service-1",
        name: "Manicure",
        priceFrom: "$45",
        duration: "45 min",
      },
      {
        id: "service-2",
        name: "Hair styling",
        priceFrom: "$80",
        duration: "1h 15 min",
      },
      {
        id: "service-3",
        name: "Makeup",
        priceFrom: "$95",
        duration: "1h",
      },
    ],
    topReviews: [
      {
        id: "review-1",
        authorName: "Kateryna",
        authorAvatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
        rating: 4,
        text: "Amazing experience from start to finish. Very professional approach, attention to details, high-quality materials...",
      },
      {
        id: "review-2",
        authorName: "Kristina",
        authorAvatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
        rating: 5,
        text: "The team was friendly and the service felt very personal. I would definitely come back again.",
      },
      {
        id: "review-3",
        authorName: "Anna",
        authorAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
        rating: 5,
        text: "Beautiful salon, clean space, and very professional service. Highly recommended.",
      },
    ],
  },
];