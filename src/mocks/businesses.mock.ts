import { Business } from "../types/business";

export const businessesMock: Business[] = [
  {
    id: "1",
    name: "Zelenska Beauty",
    category: "Beauty",
    location: "Beverly Hills / California",
    recommendedBy: "Recommended by ToryProNails and 4 others",
    rating: 4.5,
    image: "https://picsum.photos/200/200?1",
  },
  {
    id: "2",
    name: "Tory Pro Nails",
    category: "Beauty",
    location: "Beverly Hills / California",
    recommendedBy: "Recommended by Zelenska Beauty and 4 others",
    rating: 4.3,
    image: "https://picsum.photos/200/200?2",
  },
];