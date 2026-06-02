import type { Ionicons } from "@expo/vector-icons";

export const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  beauty: "cut-outline",
  auto: "car-sport-outline",
  food: "restaurant-outline",
  "home-repair": "construct-outline",
  education: "school-outline",
  "health-medical": "medical-outline",
  shopping: "bag-outline",
  entertainment: "musical-notes-outline",
};

export const getCategoryIcon = (
  slug?: string | null,
): keyof typeof Ionicons.glyphMap => {
  if (!slug) return "grid-outline";

  return CATEGORY_ICONS[slug] ?? "grid-outline";
};
