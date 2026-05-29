import BusinessCard from "@/src/components/business/BusinessCard/BusinessCard";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import CategoryScroller from "@/src/components/home/CategoryScroller/CategoryScroller";
import HomePromotionBanner from "@/src/components/home/HomePromotionBanner";
import HomePromotionModal from "@/src/components/home/HomePromotionModal/HomePromotionModal";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { useCategories } from "@/src/features/categories/hooks/useCategories";
import {
  DEFAULT_LOCATION_OPTIONS,
  LocationOption,
} from "@/src/constants/locations";
import { useBusinesses } from "@/src/features/businesses";
import { useDiscoveryFeed } from "@/src/features/discovery/hooks/useDiscoveryFeed";
import { useBannerPromotion } from "@/src/features/promotions/hooks/useBannerPromotion";
import { useBannerPromotions } from "@/src/features/promotions/hooks/useBannerPromotions";
import type { HomePromotion } from "@/src/features/promotions/types/promotion.types";
import { useAuthStore } from "@/src/store/auth.store";
import { useDiscoveryLocationStore } from "@/src/store/discovery-location";
import { useFilterStore } from "@/src/store/filter.store";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const RECENT_SEARCHES_KEY = "home-recent-searches";

export default function HomeScreen() {
  const {
    label: selectedLocationLabel,
    setManualLocation,
    setNearbyLocation,
    setPermissionStatus,
  } = useDiscoveryLocationStore();

  const scrollY = useRef(new Animated.Value(0)).current;

  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { category, sort, cuisines, rating, distance, customDistance } =
    useFilterStore((state) => state.discoveryFilters);

  // Серверные фильтры: category, sort, rating
  const serverParams = useMemo(() => {
    const params: Record<string, string | number> = {};
    if (category) params.categoryName = category;
    if (sort && sort !== "relevance" && sort !== "distance") params.sort = sort;
    if (rating && rating !== "custom") params.minRating = Number(rating);
    return params;
  }, [category, sort, rating]);

  const { businesses, isLoading } = useBusinesses(
    Object.keys(serverParams).length > 0 ? serverParams : undefined,
  );

  const isGuest = useAuthStore((state) => state.isGuest);

  const { categories } = useCategories();
  const categoryNames = ["All Categories", ...categories.map((c) => c.name)];

  useEffect(() => {
    const loadRecentSearches = async () => {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);

      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    };

    loadRecentSearches();
  }, []);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const { filteredBusinesses: discoveryFilteredBusinesses } = useDiscoveryFeed({
    businesses,
    // category, sort, rating уже применены на сервере — передаём нейтральные значения
    category: "",
    sort: sort === "distance" ? "distance" : "relevance",
    cuisines,
    rating: "",
    distance,
    customDistance,
  });

  const filteredBusinesses = normalizedSearchQuery
    ? discoveryFilteredBusinesses.filter((business) =>
        business.name?.toLowerCase().startsWith(normalizedSearchQuery),
      )
    : discoveryFilteredBusinesses;

  const visibleBusinesses = isGuest
    ? filteredBusinesses.slice(0, 10)
    : filteredBusinesses;

  const {
    promotion,
    isVisible: isPromotionVisible,
    closePromotion,
  } = useBannerPromotion();

  const { promotions: bannerPromotions, isVisible: isBannerVisible } =
    useBannerPromotions();

  const saveRecentSearch = async (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) return;

    const updated = [
      trimmed,
      ...recentSearches.filter((item) => item !== trimmed),
    ].slice(0, 3);

    setRecentSearches(updated);
    await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const removeRecentSearch = async (value: string) => {
    const updated = recentSearches.filter((item) => item !== value);

    setRecentSearches(updated);
    await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const clearRecentSearches = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSelectRecentSearch = (value: string) => {
    setSearchQuery(value);
    setIsSearchFocused(false);
  };

  const handleBusinessPress = (businessId: string) => {
    saveRecentSearch(searchQuery);
    setIsSearchFocused(false);

    router.push({
      pathname: "/business/[id]",
      params: { id: businessId },
    });
  };

  const shouldShowRecentSearches =
    isSearchFocused && recentSearches.length > 0 && !searchQuery.trim();

  const handlePromotionBannerPress = (promotion: HomePromotion) => {
    router.push({
      pathname: "/business/[id]",
      params: { id: String(promotion.businessId) },
    });
  };

  const handlePromotionPress = () => {
    if (!promotion) return;

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

  const selectedHomeCategory = category || "All Categories";

  const handleSelectCategory = (selectedCategory: string) => {
    const mappedCategory = selectedCategory === "All Categories" ? "" : selectedCategory;
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
      searchValue={searchQuery}
      onSearchChangeText={handleSearchChange}
      onSearchFocus={() => setIsSearchFocused(true)}
      onSearchBlur={() => {
        setTimeout(() => {
          setIsSearchFocused(false);
        }, 120);
      }}
      actions={["map", "filter"]}
      onPressMap={handleMapPress}
      onPressFilter={handleFilterPress}
      activeFilterCount={activeFilterCount}
    />
  );

  const recentSearchesDropdown = shouldShowRecentSearches ? (
    <View style={styles.recentDropdown}>
      <View style={styles.recentHeader}>
        <Text style={styles.recentTitle}>Recent searches</Text>

        <Pressable onPress={clearRecentSearches}>
          <Text style={styles.clearAll}>Clear all</Text>
        </Pressable>
      </View>

      {recentSearches.map((item) => (
        <View key={item} style={styles.recentItem}>
          <Pressable
            style={styles.recentItemButton}
            onPress={() => handleSelectRecentSearch(item)}
          >
            <Text style={styles.recentItemText}>{item}</Text>
          </Pressable>

          <Pressable onPress={() => removeRecentSearch(item)}>
            <Feather name="x" size={16} color="#8EA399" />
          </Pressable>
        </View>
      ))}
    </View>
  ) : null;

  const categoryBar = (
    <CategoryScroller
      categories={categoryNames}
      selectedCategory={selectedHomeCategory}
      onSelectCategory={handleSelectCategory}
    />
  );

  if (isLoading) {
    return (
      <AppScreen withTopInset={false} style={styles.container}>
        <View style={styles.headerWrap}>
          {header}
          {recentSearchesDropdown}
        </View>

        <View style={styles.contentArea}>
          {categoryBar}
          <AppLoader />
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <View style={styles.headerWrap}>
        {header}
        {recentSearchesDropdown}
      </View>

      <View style={styles.contentArea}>
        <Animated.ScrollView
          stickyHeaderIndices={[1]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
        >
          <View style={[styles.bannerWrap, (!isBannerVisible || searchQuery.trim()) && { height: 0, overflow: 'hidden' }]}>
            <HomePromotionBanner
              promotions={bannerPromotions}
              visible={isBannerVisible && !searchQuery.trim()}
              onPressPromotion={handlePromotionBannerPress}
            />
          </View>

          <View style={styles.stickyCategoryWrap}>{categoryBar}</View>

          <View style={styles.listContent}>
            {visibleBusinesses.length === 0 ? (
              <View style={styles.emptyStateWrap}>
                <AppEmptyState
                  title={
                    searchQuery.trim()
                      ? `No businesses found for "${searchQuery}"`
                      : "No businesses found"
                  }
                  description={
                    searchQuery.trim()
                      ? "Try another business name."
                      : "Try adjusting or clearing some filters to discover more places."
                  }
                  actionLabel={
                    searchQuery.trim() ? "Clear search" : "Clear filters"
                  }
                  onPressAction={() => {
                    if (searchQuery.trim()) {
                      setSearchQuery("");
                      return;
                    }

                    useFilterStore.getState().reset("discovery");
                  }}
                />
              </View>
            ) : (
              visibleBusinesses.map((item) => (
                <BusinessCard
                  key={String(item.id)}
                  business={item}
                  onPress={() => handleBusinessPress(String(item.id))}
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

  headerWrap: {
    position: "relative",
    zIndex: 100,
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

  recentDropdown: {
    position: "absolute",
    top: "100%",
    left: 16,
    right: 16,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#163126",
    gap: 12,
    zIndex: 999,
    elevation: 20,
  },

  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  recentTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  clearAll: {
    fontSize: 13,
    fontWeight: "700",
    color: "#7CCF9A",
  },

  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  recentItemButton: {
    flex: 1,
    paddingVertical: 4,
  },

  recentItemText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
});
