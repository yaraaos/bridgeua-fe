import BusinessCard from "@/src/components/business/BusinessCard/BusinessCard";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { spacing } from "@/src/constants/spacing";
import { useBusinesses } from "@/src/features/businesses";
import { useFilterStore } from "@/src/store/filter.store";
import { useFollowingStore } from "@/src/store/following.store";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

export default function ProfileFollowingScreen() {
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { businesses } = useBusinesses();

  const followedBusinessIds = useFollowingStore(
    (state) => state.followedBusinessIds,
  );

  const { sort, cuisines, rating, distance, customDistance } = useFilterStore(
    (state) => state.followingFilters,
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (sort && sort !== "relevance") count += 1;
    if (cuisines.length > 0) count += cuisines.length;
    if (rating) count += 1;
    if (distance) count += 1;
    if (distance === "custom" && customDistance) count += 1;

    return count;
  }, [sort, cuisines, rating, distance, customDistance]);

  const [visibleBusinessIds, setVisibleBusinessIds] = useState<string[]>([]);

  useEffect(() => {
    setVisibleBusinessIds(followedBusinessIds.map(String));
  }, []);

  const followedBusinesses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const selectedDistanceKm =
      distance === "custom"
        ? Number(customDistance || 0)
        : distance === "nearby"
          ? 1
          : distance
            ? Number(distance)
            : null;

    const selectedRatingValue =
      rating && rating !== "custom" ? Number(rating) : null;

    return businesses
      .filter((business) => visibleBusinessIds.includes(String(business.id)))
      .filter((business) => {
        const cuisineMatch =
          cuisines.length === 0 || cuisines.includes(business.category);

        const ratingMatch =
          selectedRatingValue === null ||
          Number(business.rating ?? 0) >= selectedRatingValue;

        const distanceMatch =
          selectedDistanceKm === null ||
          Number.isNaN(selectedDistanceKm) ||
          Number(business.distanceKm ?? 0) <= selectedDistanceKm;

        return cuisineMatch && ratingMatch && distanceMatch;
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
    sort,
    cuisines,
    rating,
    distance,
    customDistance,
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
      params: { scope: "following" },
    });
  };

  const handleMapPress = () => {
    router.push("/(tabs)/map");
  };

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <ScreenHeader
        title="Following"
        titleSubtitle="Businesses you follow"
        showSearch
        searchValue={search}
        onSearchChangeText={setSearch}
        searchPlaceholder="Find followed businesses"
        actions={["map", "filter"]}
        onPressMap={handleMapPress}
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
            title="No followed businesses yet"
            description="Businesses you follow will appear here."
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
