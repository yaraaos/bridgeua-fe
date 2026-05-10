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
    about: {
      title: "About Zelenska Beauty",
      description:
        "At Zelenska Beauty, we believe beauty is personal. Our team of expert stylists and beauty specialists is dedicated to helping you look and feel your absolute best. At Zelenska Beauty, we believe beauty is personal. Our team of expert stylists and beauty specialists is dedicated to helping you look and feel your absolute best.",
      isOpen: true,
      openingHours: [
        { id: "monday", day: "Monday", hours: "10:00 – 21:00" },
        { id: "tuesday", day: "Tuesday", hours: "10:00 – 21:00" },
        { id: "wednesday", day: "Wednesday", hours: "10:00 – 21:00" },
        { id: "thursday", day: "Thursday", hours: "10:00 – 21:00" },
        { id: "friday", day: "Friday", hours: "10:00 – 21:00" },
        { id: "saturday", day: "Saturday", hours: "10:00 – 21:00" },
        { id: "sunday", day: "Sunday", hours: "10:00 – 21:00" },
      ],
      contacts: [
        {
          id: "contact-address",
          type: "address",
          label: "Address",
          value:
            "9455 S Santa Monica Blvd, Beverly Hills, CA 90210, United States",
          actionUrl:
            "https://maps.google.com/?q=9455 S Santa Monica Blvd, Beverly Hills, CA 90210, United States",
        },
        {
          id: "contact-hours",
          type: "hours",
          label: "Opening hours",
          value: "Closes at 21:00",
        },
        {
          id: "contact-phone",
          type: "phone",
          label: "Phone",
          value: "+1 (310) 555-0198",
          actionUrl: "tel:+13105550198",
        },
        {
          id: "contact-website",
          type: "website",
          label: "Website",
          value: "zelenskabeauty.com",
          actionUrl: "https://zelenskabeauty.com",
        },
        {
          id: "contact-instagram",
          type: "instagram",
          label: "Instagram",
          value: "@zelenska.beauty",
          actionUrl: "https://instagram.com/zelenska.beauty",
        },
      ],
      languages: ["Ukrainian", "English", "Spanish"],

      amenities: [
        { id: "amenity-wifi", label: "Wi-Fi", icon: "wifi" },
        { id: "amenity-parking", label: "Parking", icon: "parking" },
        { id: "amenity-pet", label: "Pet friendly", icon: "pet" },
        {
          id: "amenity-accessibility",
          label: "Wheelchair accessible",
          icon: "accessibility",
        },
      ],

      socialLinks: [
        {
          id: "social-instagram",
          label: "Instagram",
          icon: "instagram",
          url: "https://instagram.com/zelenska.beauty",
        },
        {
          id: "social-telegram",
          label: "Telegram",
          icon: "telegram",
          url: "https://t.me/zelenskabeauty",
        },
        {
          id: "social-whatsapp",
          label: "WhatsApp",
          icon: "whatsapp",
          url: "https://wa.me/13105550198",
        },
      ],

      recommendedBy: [
        {
          id: "recommended-by-1",
          businessId: "2",
          businessName: "ToryProNails",
          businessCategory: "Nail Studio",
          businessLocation: "Los Angeles / California",
          businessImageUrl:
            "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300",
          recommendationsCount: 14,
        },
        {
          id: "recommended-by-2",
          businessId: "3",
          businessName: "Best Deal Market",
          businessCategory: "Grocery",
          businessLocation: "Beverly Hills / California",
          businessImageUrl:
            "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=300",
          recommendationsCount: 9,
        },
        {
          id: "recommended-by-3",
          businessId: "4",
          businessName: "Kyiv Hair Studio",
          businessCategory: "Hair Salon",
          businessLocation: "Santa Monica / California",
          businessImageUrl:
            "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300",
          recommendationsCount: 21,
        },
      ],
    },

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

    // 👇 Preview (no photos here)
    topReviews: [
      {
        id: "review-1",
        authorName: "Kateryna",
        authorAvatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
        rating: 4,
        createdAt: "2026-05-01T10:00:00.000Z",
        text: "Amazing experience from start to finish. The whole team had a very professional approach and paid close attention to every small detail throughout the appointment. The space was clean, comfortable, and beautifully organized, which made the experience even better. I really appreciated how carefully everything was explained and how much effort was put into making me feel comfortable. The results exceeded my expectations and I will definitely be coming back again.",
      },
      {
        id: "review-2",
        authorName: "Kristina",
        authorAvatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
        rating: 5,
        createdAt: "2026-05-05T12:00:00.000Z",
        text: "The team was incredibly friendly and welcoming from the moment I arrived, and the whole experience felt very personal and professional. Everything was explained clearly, the atmosphere was relaxing, and I never felt rushed during the appointment. You can really tell they care about the quality of their work and customer experience. I would definitely come back again and would also recommend this place to friends looking for reliable service. ",
      },
      {
        id: "review-3",
        authorName: "Anna",
        authorAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
        rating: 5,
        createdAt: "2026-04-20T09:30:00.000Z",
        text: "Beautiful salon, clean space, and very professional service. Highly recommended.",
      },
    ],

    // 👇 Full list (used in "All reviews")
    reviews: [
      {
        id: "review-1",
        authorName: "Kateryna",
        authorAvatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
        rating: 4,
        createdAt: "2026-05-01T10:00:00.000Z",
        text: "Amazing experience from start to finish. The whole team had a very professional approach and paid close attention to every small detail throughout the appointment. The space was clean, comfortable, and beautifully organized, which made the experience even better. I really appreciated how carefully everything was explained and how much effort was put into making me feel comfortable. The results exceeded my expectations and I will definitely be coming back again.",
        photos: [
          {
            id: "photo-1",
            url: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=500",
          },
          {
            id: "photo-2",
            url: "https://plus.unsplash.com/premium_photo-1670348051093-a3f94b408bcb?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
        ],
        tags: ["Great service", "Professional staff", "Clean & comfortable"],
      },
      {
        id: "review-2",
        authorName: "Kristina",
        authorAvatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
        rating: 5,
        createdAt: "2026-05-05T12:00:00.000Z",
        text: "The team was incredibly friendly and welcoming from the moment I arrived, and the whole experience felt very personal and professional. Everything was explained clearly, the atmosphere was relaxing, and I never felt rushed during the appointment. You can really tell they care about the quality of their work and customer experience. I would definitely come back again and would also recommend this place to friends looking for reliable service.",
      },
      {
        id: "review-3",
        authorName: "Anna",
        authorAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
        rating: 5,
        createdAt: "2026-04-20T09:30:00.000Z",
        text: "Beautiful salon, clean space, and very professional service. Highly recommended.",
        tags: ["Good value", "Easy booking"],
      },
    ],

    ratingBreakdown: [
      { rating: 5, count: 18 },
      { rating: 4, count: 7 },
      { rating: 3, count: 2 },
      { rating: 2, count: 1 },
      { rating: 1, count: 0 },
    ],

    // 👇 Aggregated gallery (top photos from reviews)
    reviewPhotos: [
      {
        id: "review-photo-1",
        url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500",
      },
      {
        id: "review-photo-2",
        url: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=500",
      },
      {
        id: "review-photo-3",
        url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500",
      },
    ],
  },
];
