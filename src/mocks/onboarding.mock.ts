export type OnboardingCard = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  variant: "green" | "blue" | "image";
  image?: string;
};

export type OnboardingSlideItem = {
  id: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  cards: OnboardingCard[];
};

export const ONBOARDING_SLIDES: OnboardingSlideItem[] = [
  {
    id: "trust",
    title: "Find businesses you can trust",
    subtitle: "Real recommendations from real people",
    buttonLabel: "Next",
    cards: [
      {
        id: "discover",
        eyebrow: "Discover",
        title: "",
        subtitle: "Browse trusted businesses recommended by others",
        variant: "image",
        image:
          "https://plus.unsplash.com/premium_vector-1682303279416-5ea8eaf84ebd?q=80&w=1397&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: "connect",
        eyebrow: "Connect",
        title: "",
        subtitle: "Contact or book services directly",
        variant: "image",
        image:
          "https://plus.unsplash.com/premium_vector-1683141067775-083bef0a5aa2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
  },
  {
    id: "everyone",
    title: "Built for everyone",
    subtitle: "Whether you're looking or offering",
    buttonLabel: "Next",
    cards: [
      {
        id: "people",
        eyebrow: "For people",
        title: "",
        subtitle: "Find trusted businesses and services recommended by others",
        variant: "image",
        image:
          "https://plus.unsplash.com/premium_vector-1682268688328-2f9a36ac0687?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: "business",
        eyebrow: "For businesses",
        title: "",
        subtitle: "Get discovered and build trust with new clients",
        variant: "image",
        image:
          "https://plus.unsplash.com/premium_vector-1683141147347-c6aa70127df2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
  },
];
