import type { AuthUser } from "@/src/features/auth/types/auth.types";
import type { Business } from "@/src/types/business";

export const ALL_CATEGORIES_LABEL = "All Categories";

const normalize = (value?: string | number | null) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

export function getOwnedBusinessId(user?: AuthUser | null) {
  return String(
    user?.ownedBusiness?.id ?? user?.activeBusinessId ?? user?.ownedBusinessIds?.[0] ?? "",
  );
}

export function isOwnedBusiness(business: Business, user?: AuthUser | null) {
  if (business.isOwnedByMe) return true;

  const ownedBusinessId = getOwnedBusinessId(user);
  const currentUserId = String(user?.id ?? "");

  return (
    (!!ownedBusinessId && String(business.id) === ownedBusinessId) ||
    (!!currentUserId && String(business.ownerId ?? "") === currentUserId)
  );
}

function isAllCategories(category?: string | null) {
  return !category || category === ALL_CATEGORIES_LABEL;
}

function isOwnedBusinessAssignedCategory(
  business: Business,
  selectedCategory?: string | null,
  user?: AuthUser | null,
) {
  if (isAllCategories(selectedCategory)) return true;

  const selected = normalize(selectedCategory);
  const businessCategory = normalize(business.category);
  const ownedBusinessCategory = normalize(user?.ownedBusiness?.categoryName);
  const ownedBusinessCategorySlug = normalize(user?.ownedBusiness?.categorySlug);

  return (
    selected === businessCategory ||
    (!!ownedBusinessCategory && selected === ownedBusinessCategory) ||
    (!!ownedBusinessCategorySlug && selected === ownedBusinessCategorySlug)
  );
}

export function prioritizeOwnedBusiness(
  businesses: Business[],
  selectedCategory: string,
  user?: AuthUser | null,
) {
  if (user?.accountType !== "business") return businesses;

  const seen = new Set<string>();
  const uniqueBusinesses = businesses.filter((business) => {
    const id = String(business.id);

    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  return [...uniqueBusinesses].sort((a, b) => {
    const aShouldBeFirst =
      isOwnedBusiness(a, user) &&
      isOwnedBusinessAssignedCategory(a, selectedCategory, user);
    const bShouldBeFirst =
      isOwnedBusiness(b, user) &&
      isOwnedBusinessAssignedCategory(b, selectedCategory, user);

    if (aShouldBeFirst === bShouldBeFirst) return 0;

    return aShouldBeFirst ? -1 : 1;
  });
}
