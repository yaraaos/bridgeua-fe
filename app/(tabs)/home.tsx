import BusinessCard from "@/src/components/business/BusinessCard/BusinessCard";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import CategoryScroller from "@/src/components/home/CategoryScroller/CategoryScroller";
import HomePromotionBanner from "@/src/components/home/HomePromotionBanner";
import HomePromotionModal from "@/src/components/home/HomePromotionModal/HomePromotionModal";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { HOME_CATEGORIES } from "@/src/constants/categories";
import {
  DEFAULT_LOCATION_OPTIONS,
  LocationOption,
} from "@/src/constants/locations";
import { useBusinesses } from "@/src/features/businesses";
import { useDiscoveryFeed } from "@/src/features/discovery/hooks/useDiscoveryFeed";
import { useBannerPromotion } from "@/src/features/promotions/hooks/useBannerPromotion";
import { useBannerPromotions } from "@/src/features/promotions/hooks/useBannerPromotions";
import type { HomePromotion } from "@/src/features/promotions/types/promotion.types";
import { useDiscoveryLocationStore } from "@/src/store/discovery-location";
import { useFilterStore } from "@/src/store/filter.store";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Animated, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const {
    label: selectedLocationLabel,
    setManualLocation,
    setNearbyLocation,
    setPermissionStatus,
  } = useDiscoveryLocationStore();

  const scrollY = useRef(new Animated.Value(0)).current;
  const [searchQuery, setSearchQuery] = useState("");

  const { category, sort, cuisines, rating, distance, customDistance } =
    useFilterStore((state) => state.discoveryFilters);
  const { businesses, isLoading } = useBusinesses();

  const searchFiltered = searchQuery.trim()
    ? businesses.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.location?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : businesses;

  const { filteredBusinesses } = useDiscoveryFeed({
    businesses: searchFiltered,
    category,
    sort,
    cuisines,
    rating,
    distance,
    customDistance,
  });

  const {
    promotion,
    isVisible: isPromotionVisible,
    closePromotion,
  } = useBannerPromotion();

  const { promotions: bannerPromotions, isVisible: isBannerVisible } =
    useBannerPromotions();

  const handlePromotionBannerPress = (promotion: HomePromotion) => {
    router.push({
      pathname: "/business/[id]",
      params: { id: String(promotion.businessId) },
    });
  };

  const handlePromotionPress = () => {
    if (!promotion) {
      return;
    }

    closePromotion();

    router.push({
      pathname: "/business/[id]",
      params: { id: String(promotion.businessId) },
    });
  };

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
    router.push("/(tabs)/map");
  };

  const handleFilterPress = () => {
    router.push({
      pathname: "/modal/filter",
      params: { scope: "discovery" },
    });
  };

  const selectedHomeCategory = !category
    ? "All Categories"
    : category === "Automotive"
      ? "Auto"
      : category;

  const handleSelectCategory = (selectedCategory: string) => {
    const mappedCategory =
      selectedCategory === "All Categories"
        ? ""
        : selectedCategory === "Auto"
          ? "Automotive"
          : selectedCategory;

    useFilterStore.getState().setCategory("discovery", mappedCategory);
  };

  const activeFilterCount =
    (category ? 1 : 0) +
    (sort !== "relevance" ? 1 : 0) +
    cuisines.length +
    (rating ? 1 : 0) +
    (distance ? 1 : 0) +
    (distance === "custom" && customDistance ? 1 : 0);

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
      onPressSearch={() => router.push("/search")}
      searchValue={searchQuery}
      onSearchChangeText={setSearchQuery}
      actions={["map", "filter"]}
      onPressMap={handleMapPress}
      onPressFilter={handleFilterPress}
      activeFilterCount={activeFilterCount}
    />
  );

  const categoryBar = (
    <CategoryScroller
      categories={HOME_CATEGORIES}
      selectedCategory={selectedHomeCategory}
      onSelectCategory={handleSelectCategory}
    />
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
        <Animated.ScrollView
          stickyHeaderIndices={[1]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
        >
          {isBannerVisible ? (
            <View style={styles.bannerWrap}>
              <HomePromotionBanner
                promotions={bannerPromotions}
                visible={isBannerVisible}
                onPressPromotion={handlePromotionBannerPress}
              />
            </View>
          ) : null}

          <View style={styles.stickyCategoryWrap}>{categoryBar}</View>

          <View style={styles.listContent}>
            {filteredBusinesses.length === 0 ? (
              <View style={styles.emptyStateWrap}>
                <AppEmptyState
                  title="No businesses found"
                  description="Try adjusting or clearing some filters to discover more places."
                  actionLabel="Clear filters"
                  onPressAction={() =>
                    useFilterStore.getState().reset("discovery")
                  }
                />
              </View>
            ) : (
              filteredBusinesses.map((item) => (
                <BusinessCard
                  key={String(item.id)}
                  business={item}
                  onPress={() =>
                    router.push({
                      pathname: "/business/[id]",
                      params: { id: String(item.id) },
                    })
                  }
                />
              ))
            )}
          </View>
        </Animated.ScrollView>
      </View>

      <HomePromotionModal
        visible={isPromotionVisible}
        promotion={promotion}
        onClose={closePromotion}
        onPressCta={handlePromotionPress}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  contentArea: {
    flex: 1,
  },
  cardWrap: {
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 4,
  },
  bannerWrap: {
    overflow: "hidden",
    marginBottom: -10,
  },

  stickyCategoryWrap: {
    backgroundColor: "#F7F7F5",
    zIndex: 10,
    marginBottom: -2,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 4,
  },
  emptyStateWrap: {
    paddingTop: 48,
    paddingBottom: 32,
  },
});
