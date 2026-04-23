import { router } from "expo-router";

import { useBusinesses } from "@/src/features/businesses";
import { FlatList, StyleSheet, View } from "react-native";
import BusinessCard from "../../src/components/business/BusinessCard/BusinessCard";
import ScreenHeader from "../../src/components/common/ScreenHeader/ScreenHeader";
import CategoryScroller from "../../src/components/home/CategoryScroller/CategoryScroller";
import AppLoader from "../../src/components/ui/AppLoader/AppLoader";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import { HOME_CATEGORIES } from "../../src/constants/categories";
import { useFilterStore } from "../../src/store/filter.store";

const CATEGORY_BAR_HEIGHT = 48;

export default function HomeScreen() {
  const { sort, cuisines, rating, distance, customDistance } = useFilterStore();
  const { businesses, isLoading } = useBusinesses();

  const handleLocationPress = () => {
    console.log("Open location picker");
  };

  const handleMapPress = () => {
    console.log("Open map");
  };

  const handleFilterPress = () => {
    router.push("/modal/filter");
  };

  const handleAddPress = () => {
    router.push("/add-business/search");
  };

  const selectedDistanceKm =
    distance === "Nearby"
      ? 1
      : distance === "1 km"
        ? 1
        : distance === "5 km"
          ? 5
          : distance === "10 km"
            ? 10
            : distance === "25 km"
              ? 25
              : distance === "custom"
                ? Number(customDistance || 0)
                : null;

  const selectedRatingValue =
    rating && rating !== "Any rating"
      ? Number(String(rating).replace("+", ""))
      : null;

  const selectedHomeCategory =
    cuisines.length === 0
      ? "All Categories"
      : cuisines[0] === "Automotive"
        ? "Auto"
        : cuisines[0];

  const handleSelectCategory = (category: string) => {
    if (category === "All Categories") {
      useFilterStore.setState({
        cuisines: [],
      });
      return;
    }

    const mappedCategory = category === "Auto" ? "Automotive" : category;

    useFilterStore.setState({
      cuisines: [mappedCategory],
    });
  };

  const filteredBusinesses = [...businesses]
    .filter((business) => {
      const businessCategory = String(business.category ?? "").trim();
      const businessRating = Number(business.rating ?? 0);
      const businessDistance = Number(business.distanceKm ?? 0);

      const cuisineMatch =
        cuisines.length === 0 || cuisines.includes(businessCategory);

      const ratingMatch =
        selectedRatingValue === null || businessRating >= selectedRatingValue;

      const distanceMatch =
        selectedDistanceKm === null ||
        Number.isNaN(selectedDistanceKm) ||
        businessDistance <= selectedDistanceKm;

      return cuisineMatch && ratingMatch && distanceMatch;
    })
    .sort((a, b) => {
      if (sort === "Distance") {
        return Number(a.distanceKm ?? 0) - Number(b.distanceKm ?? 0);
      }

      if (sort === "Rating") {
        return Number(b.rating ?? 0) - Number(a.rating ?? 0);
      }

      if (sort === "Cost: Low to High") {
        return Number(a.priceLevel ?? 0) - Number(b.priceLevel ?? 0);
      }

      if (sort === "Cost: High to Low") {
        return Number(b.priceLevel ?? 0) - Number(a.priceLevel ?? 0);
      }

      return 0;
    });

  if (isLoading) {
    return (
      <AppScreen withTopInset={false} style={styles.container}>
        <ScreenHeader
          title="Discover"
          titleSubtitle="Community trusted places"
          subtitleLabel="Location"
          subtitleValue="California, USA"
          onSubtitlePress={handleLocationPress}
          showSubtitleChevron
          showSearch
          searchPlaceholder="Find services, food or places"
          actions={["map", "filter", "add"]}
          onPressMap={handleMapPress}
          onPressFilter={handleFilterPress}
          onPressAdd={handleAddPress}
        />

        <View style={styles.contentArea}>
          <View style={styles.categoryOverlay}>
            <CategoryScroller
              categories={HOME_CATEGORIES}
              selectedCategory={selectedHomeCategory}
              onSelectCategory={handleSelectCategory}
            />
          </View>

          <AppLoader />
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <ScreenHeader
        title="Discover"
        titleSubtitle="Community trusted places"
        subtitleLabel="Location"
        subtitleValue="California, USA"
        onSubtitlePress={handleLocationPress}
        showSubtitleChevron
        showSearch
        searchPlaceholder="Find services, food or places"
        actions={["map", "filter", "add"]}
        onPressMap={handleMapPress}
        onPressFilter={handleFilterPress}
        onPressAdd={handleAddPress}
      />

      <View style={styles.contentArea}>
        <View style={styles.categoryOverlay}>
          <CategoryScroller
            categories={HOME_CATEGORIES}
            selectedCategory={selectedHomeCategory}
            onSelectCategory={handleSelectCategory}
          />
        </View>

        <FlatList
          data={filteredBusinesses}
          keyExtractor={(item) => String(item.id)}
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  contentArea: {
    flex: 1,
    position: "relative",
  },
  categoryOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  listContent: {
    paddingTop: CATEGORY_BAR_HEIGHT + 8,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
