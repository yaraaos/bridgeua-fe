import BusinessCard from "@/src/components/business/BusinessCard/BusinessCard";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { spacing } from "@/src/constants/spacing";
import { useBusinesses } from "@/src/features/businesses";
import { useFilterStore } from "@/src/store/filter.store";
import { useAppStore } from "@/src/store/app.store";
import { useFollowingStore } from "@/src/store/following.store";
import type { Business } from "@/src/types/business";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

const FOOD_SUBCATEGORIES = [
  "Ukrainian",
  "Italian",
  "Japanese",
  "Georgian",
  "American",
  "Chinese",
  "Mediterranean",
  "Mexican",
  "Vegan",
];

const CATEGORY_ALIASES: Record<string, string[]> = {
  Food: FOOD_SUBCATEGORIES,
  Beauty: ["Beauty"],
  Healthcare: ["Healthcare", "Health & Medical"],
  Shopping: ["Shopping"],
  Services: ["Services", "Home & Repair", "Automotive"],
};

const getBusinessSubcategories = (business: Business) => {
  return [(business as any).cuisine, business.category].filter(Boolean);
};

const doesBusinessMatchCategory = (business: Business, category: string) => {
  if (!category) return true;
  if (category === "Food") {
    return business.category === "Food" ||
      ["American", "Chinese", "Italian", "Japanese",
       "Mediterranean", "Mexican", "Ukrainian", "Vegan"]
      .includes(business.category ?? "");
  }
  const allowedCategories = CATEGORY_ALIASES[category] ?? [category];
  return allowedCategories.includes(business.category);
};

const doesBusinessMatchSubcategories = (
  business: Business,
  subcategories: string[],
) => {
  if (subcategories.length === 0) {
    return true;
  }

  const businessSubcategories = getBusinessSubcategories(business);

  return subcategories.some((subcategory) =>
    businessSubcategories.includes(subcategory),
  );
};

export default function ProfileFollowingScreen() {
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const businessesVersion = useAppStore((s) => s.businessesVersion);
  const { businesses } = useBusinesses(undefined, businessesVersion);

  const followedBusinessIds = useFollowingStore(
    (state) => state.followedBusinessIds,
  );

  const { category, sort, cuisines, rating, distance } =
    useFilterStore((state) => state.profileFollowingFilters);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (category) count += 1;
    if (sort && sort !== "relevance") count += 1;
    if (cuisines.length > 0) count += cuisines.length;
    if (rating) count += 1;
    if (distance) count += 1;

    return count;
  }, [category, sort, cuisines, rating, distance]);

  const [visibleBusinessIds, setVisibleBusinessIds] = useState<string[]>([]);

  useEffect(() => {
    setVisibleBusinessIds(followedBusinessIds.map(String));
  }, [followedBusinessIds]);

  const followedBusinesses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const selectedDistanceKm =
      distance === "nearby"
        ? 1
        : distance
          ? Number(distance)
          : null;

    const selectedRatingValue = rating ? Number(rating) : null;

    return businesses
      .filter((business) => visibleBusinessIds.includes(String(business.id)))
      .filter((business) => {
        const categoryMatch = doesBusinessMatchCategory(business, category);

        const subcategoryMatch = doesBusinessMatchSubcategories(
          business,
          cuisines,
        );

        const ratingMatch =
          selectedRatingValue === null ||
          Number(business.rating ?? 0) >= selectedRatingValue;

        const distanceMatch =
          selectedDistanceKm === null ||
          Number.isNaN(selectedDistanceKm) ||
          Number(business.distanceKm ?? 0) <= selectedDistanceKm;

        return (
          categoryMatch && subcategoryMatch && ratingMatch && distanceMatch
        );
      })
      .filter((business) => {
        if (!normalizedSearch) {
          return true;
        }

        return (
          business.name.toLowerCase().includes(normalizedSearch) ||
          business.category.toLowerCase().includes(normalizedSearch) ||
          business.location.toLowerCase().includes(normalizedSearch)
        );
      })
      .sort((a, b) => {
        if (sort === "distance") {
          return Number(a.distanceKm ?? 0) - Number(b.distanceKm ?? 0);
        }

        if (sort === "rating") {
          return Number(b.rating ?? 0) - Number(a.rating ?? 0);
        }

        if (sort === "price_low") {
          return Number(a.priceLevel ?? 0) - Number(b.priceLevel ?? 0);
        }

        if (sort === "price_high") {
          return Number(b.priceLevel ?? 0) - Number(a.priceLevel ?? 0);
        }

        return 0;
      });
  }, [
    businesses,
    visibleBusinessIds,
    search,
    category,
    sort,
    cuisines,
    rating,
    distance,
  ]);

  const handleRefresh = () => {
    setRefreshing(true);

    setVisibleBusinessIds(followedBusinessIds.map(String));

    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleFilterPress = () => {
    router.push({
      pathname: "/modal/filter",
      params: { scope: "profileFollowing" },
    });
  };

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <ScreenHeader
        title="Following"
        titleSubtitle="Businesses you follow"
        onBack={() => router.back()}
        showSearch
        searchValue={search}
        onSearchChangeText={setSearch}
        searchPlaceholder="Find followed businesses"
        actions={["filter"]}
        onPressFilter={handleFilterPress}
        activeFilterCount={activeFilterCount}
      />

      <FlatList
        data={followedBusinesses}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          followedBusinesses.length === 0 && styles.emptyContent,
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <BusinessCard
            business={item}
            onPress={() =>
              router.push({
                pathname: "/business/[id]",
                params: { id: String(item.id) },
              })
            }
          />
        )}
        ListEmptyComponent={
          <AppEmptyState
            title="No followed businesses found"
            description={
              activeFilterCount > 0
                ? "Try adjusting or clearing your filters."
                : "Follow businesses to see them here."
            }
            actionLabel={activeFilterCount > 0 ? "Clear filters" : undefined}
            onPressAction={
              activeFilterCount > 0
                ? () => useFilterStore.getState().reset("profileFollowing")
                : undefined
            }
          />
        }
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  separator: {
    height: spacing.xs,
  },
});
