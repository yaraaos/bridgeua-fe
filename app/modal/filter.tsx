//app/modal/filter.tsx

import type {
    DistanceOption,
    RatingOption,
    SortOption,
} from "@/src/store/filter.store";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    Pressable,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DistanceSelector from "../../src/components/filters/DistanceSelector/DistanceSelector";
import FilterOptionList from "../../src/components/filters/FilterOptionList/FilterOptionList";
import FilterSidebar from "../../src/components/filters/FilterSidebar/FilterSidebar";
import RatingSelector from "../../src/components/filters/RatingSelector/RatingSelector";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import { colors } from "../../src/constants/colors";
import { useFilterStore } from "../../src/store/filter.store";

type FilterTab = "sort" | "cuisines" | "ratings" | "distance";

export const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Relevance (Default)", value: "relevance" },
  { label: "Distance", value: "distance" },
  { label: "Rating", value: "rating" },
  { label: "Cost: Low to High", value: "price_low" },
  { label: "Cost: High to Low", value: "price_high" },
];

export const RATING_OPTIONS: { label: string; value: RatingOption }[] = [
  { label: "Any rating", value: "" },
  { label: "4+ stars", value: "4" },
  { label: "3+ stars", value: "3" },
  { label: "2+ stars", value: "2" },
  { label: "1+ stars", value: "1" },
];

export const DISTANCE_OPTIONS: { label: string; value: DistanceOption }[] = [
  { label: "Any distance", value: "" },
  { label: "1 km", value: "1" },
  { label: "5 km", value: "5" },
  { label: "10 km", value: "10" },
  { label: "25 km", value: "25" },
  { label: "Custom", value: "custom" },
];

const CUISINE_OPTIONS = [
  "American",
  "Chinese",
  "Italian",
  "Japanese",
  "Mediterranean",
  "Mexican",
  "Vegan",
];

export default function FilterModalScreen() {
  const insets = useSafeAreaInsets();
  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const [activeTab, setActiveTab] = useState<FilterTab>("sort");
  const [isClosing, setIsClosing] = useState(false);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const params = useLocalSearchParams<{ scope?: string }>();

  const scope = params.scope === "following" ? "following" : "discovery";
  const filters = useFilterStore((state) =>
    scope === "following" ? state.followingFilters : state.discoveryFilters,
  );

  const { sort, cuisines, rating, distance, customDistance } = filters;

  const {
    setSort,
    toggleCuisine,
    setRating,
    setDistance,
    setCustomDistance,
    reset,
  } = useFilterStore();

  useEffect(() => {
    //opening modal animation
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [backdropOpacity, sheetTranslateY]);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: SCREEN_HEIGHT,
        duration: 240,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        router.back();
      }
    });
  };

  const sidebarItems = useMemo(
    () => [
      { key: "sort" as FilterTab, label: "Sort" },
      { key: "cuisines" as FilterTab, label: "Cuisines" },
      { key: "ratings" as FilterTab, label: "Ratings" },
      { key: "distance" as FilterTab, label: "Distance" },
    ],
    [],
  );

  const renderRightPanel = () => {
    if (activeTab === "sort") {
      return (
        <FilterOptionList
          title="SORT BY"
          type="radio"
          options={SORT_OPTIONS}
          selectedValue={sort}
          onSelect={(value) => setSort(scope, value)}
        />
      );
    }

    if (activeTab === "cuisines") {
      return (
        <FilterOptionList
          title="FILTER BY CUISINE"
          type="checkbox"
          options={CUISINE_OPTIONS}
          selectedValues={cuisines}
          onToggle={(value) => toggleCuisine(scope, value)}
        />
      );
    }

    if (activeTab === "ratings") {
      return (
        <RatingSelector
          value={rating}
          onChange={(value) => setRating(scope, value)}
        />
      );
    }

    return (
      <DistanceSelector
        value={distance}
        customValue={customDistance}
        onChange={(value) => setDistance(scope, value)}
        onChangeCustom={(value) => setCustomDistance(scope, value)}
      />
    );
  };

  return (
    <View style={styles.root}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY: sheetTranslateY }],
          },
        ]}
      >
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filter</Text>

          <Pressable onPress={handleClose} style={styles.closeButton}>
            <Feather name="x" size={18} color={colors.textMuted} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <FilterSidebar
            items={sidebarItems}
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
          />

          <View style={styles.rightPanel}>{renderRightPanel()}</View>
        </View>

        <View
          style={[
            styles.footer,
            {
              paddingBottom: 14 + insets.bottom,
            },
          ]}
        >
          <Pressable onPress={() => reset(scope)}>
            <Text style={styles.clearText}>Clear Filters</Text>
          </Pressable>

          <View style={styles.applyWrap}>
            <AppButton
              title="Apply"
              variant="secondary"
              onPress={handleClose}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.68)",
  },
  sheet: {
    height: "72%",
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  handle: {
    alignSelf: "center",
    width: 46,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#D7D7D2",
    marginTop: 10,
    marginBottom: 6,
  },
  header: {
    minHeight: 64,
    paddingHorizontal: 24,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: "#EFEFEA",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  rightPanel: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  footer: {
    minHeight: 70,
    paddingHorizontal: 24,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  clearText: {
    fontSize: 15,
    paddingHorizontal: 24,
    fontWeight: "500",
    color: colors.accentOrange,
  },
  applyWrap: {
    width: 136,
  },
});
