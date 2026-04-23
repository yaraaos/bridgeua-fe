import { useBusinesses } from "@/src/features/businesses";
import { router } from "expo-router";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import BusinessCard from "../../src/components/business/BusinessCard/BusinessCard";
import ScreenHeader from "../../src/components/common/ScreenHeader/ScreenHeader";
import CategoryScroller from "../../src/components/home/CategoryScroller/CategoryScroller";
import AppLoader from "../../src/components/ui/AppLoader/AppLoader";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import { HOME_CATEGORIES } from "../../src/constants/categories";
import {
  DEFAULT_LOCATION_OPTIONS,
  LocationOption,
} from "../../src/constants/locations";
import { useFilterStore } from "../../src/store/filter.store";
import { useLocationStore } from "../../src/store/location.store";

const CATEGORY_BAR_HEIGHT = 48;

const distanceMap: Record<string, number> = {
  Nearby: 1,
  "1 km": 1,
  "5 km": 5,
  "10 km": 10,
  "25 km": 25,
};

export default function HomeScreen() {
  const {
    label: selectedLocationLabel,
    value: selectedLocationValue,
    setManualLocation,
    setNearbyLocation,
    setPermissionStatus,
  } = useLocationStore();
  const { sort, cuisines, rating, distance, customDistance } = useFilterStore();
  const { businesses, isLoading } = useBusinesses();

  const handleLocationPress = () => {
    console.log("Location selector is handled inside ScreenHeader");
  };
  const handleSelectLocationOption = (option: LocationOption) => {
    setManualLocation({
      label: option.label,
      value: option.value,
    });
  };

  const handleRequestNearby = () => {
    Alert.alert(
      "Use your location?",
      "Allow location access to find businesses near you.",
      [
        {
          text: "Not now",
          style: "cancel",
          onPress: () => setPermissionStatus("denied"),
        },
        {
          text: "Allow",
          onPress: () => {
            setPermissionStatus("granted");
            setNearbyLocation({
              label: "Near you",
              value: "nearby",
              latitude: 34.0549,
              longitude: -118.2426,
            });
          },
        },
      ],
    );
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
    distance === "custom"
      ? Number(customDistance || 0)
      : (distanceMap[distance] ?? null);

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
      useFilterStore.setState({ cuisines: [] });
      return;
    }

    const mappedCategory = category === "Auto" ? "Automotive" : category;

    useFilterStore.setState({
      cuisines: [mappedCategory],
    });
  };

  const sortBusinesses = (a: any, b: any) => {
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
    .sort(sortBusinesses);

  const header = (
    <ScreenHeader
      title="Discover"
      titleSubtitle="Community trusted places"
      subtitleValue={selectedLocationLabel}
      onSubtitlePress={handleLocationPress}
      showSubtitleChevron
      locationOptions={DEFAULT_LOCATION_OPTIONS}
      onSelectLocationOption={handleSelectLocationOption}
      onRequestNearby={handleRequestNearby}
      showSearch
      searchPlaceholder="Find services, food or places"
      actions={["map", "filter", "add"]}
      onPressMap={handleMapPress}
      onPressFilter={handleFilterPress}
      onPressAdd={handleAddPress}
    />
  );

  const categoryBar = (
    <View style={styles.categoryOverlay}>
      <CategoryScroller
        categories={HOME_CATEGORIES}
        selectedCategory={selectedHomeCategory}
        onSelectCategory={handleSelectCategory}
      />
    </View>
  );

  if (isLoading) {
    return (
      <AppScreen withTopInset={false} style={styles.container}>
        {header}

        <View style={styles.contentArea}>
          {categoryBar}
          <AppLoader />
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      {header}

      <View style={styles.contentArea}>
        {categoryBar}

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
    paddingBottom: 4,
  },
});
