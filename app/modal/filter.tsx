// app/modal/filter.tsx

import ActiveFiltersSummary from "@/src/components/filters/ActiveFiltersSummary";
import { AppColors } from "@/src/constants/colors";
import { CUISINE_OPTIONS, SORT_OPTIONS } from "@/src/constants/filters";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useFilterStore } from "@/src/store/filter.store";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  Pressable,
  ScrollView,
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

type FilterTab = "sort" | "cuisines" | "ratings" | "distance";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const HALF_HEIGHT = SCREEN_HEIGHT * 0.72;
const FULL_HEIGHT = SCREEN_HEIGHT * 0.92;
const EXPAND_THRESHOLD = 30;
const COLLAPSE_THRESHOLD = 40;

export default function FilterModalScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<FilterTab>("sort");
  const [isClosing, setIsClosing] = useState(false);

  // useNativeDriver: true — transform only
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // useNativeDriver: false — height (JS thread only)
  const sheetHeight = useRef(new Animated.Value(HALF_HEIGHT)).current;

  const params = useLocalSearchParams<{ scope?: string }>();
  const scope = params.scope === "following" ? "following" : "discovery";

  const filters = useFilterStore((state) =>
    scope === "following" ? state.followingFilters : state.discoveryFilters,
  );
  const { category, sort, cuisines, rating, distance, customDistance } =
    filters;
  const {
    setSort,
    toggleCuisine,
    setRating,
    setDistance,
    setCustomDistance,
    reset,
  } = useFilterStore();

  // ─── Open animation ───────────────────────────────────────────────────
  useEffect(() => {
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

  // ─── Close ───────────────────────────────────────────────────
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
      if (finished) router.back();
    });
  };

  // ─── Expand / Collapse ───────────────────────────────────────────────────
  const isExpandedRef = useRef(false);

  const expandSheet = () => {
    isExpandedRef.current = true;
    Animated.spring(sheetHeight, {
      toValue: FULL_HEIGHT,
      useNativeDriver: false,
      bounciness: 4,
      speed: 14,
    }).start();
  };

  const collapseSheet = () => {
    isExpandedRef.current = false;
    Animated.spring(sheetHeight, {
      toValue: HALF_HEIGHT,
      useNativeDriver: false,
      bounciness: 4,
      speed: 14,
    }).start();
  };

  // ─── PanResponder (handle + header only) ─────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, { dy }) => Math.abs(dy) > 5,
      onPanResponderRelease: (_, { dy }) => {
        if (dy < -EXPAND_THRESHOLD && !isExpandedRef.current) {
          expandSheet();
          return;
        }

        if (dy > COLLAPSE_THRESHOLD && isExpandedRef.current) {
          collapseSheet();
          return;
        }

        if (dy > COLLAPSE_THRESHOLD && !isExpandedRef.current) {
          handleClose();
        }
      },
    }),
  ).current;

  // ─── Sidebar items ───────────────────────────────────────────────────
  const sidebarItems = useMemo(
    () => [
      { key: "sort" as FilterTab, label: "Sort" },
      { key: "cuisines" as FilterTab, label: "Food" },
      { key: "ratings" as FilterTab, label: "Ratings" },
      { key: "distance" as FilterTab, label: "Distance" },
    ],
    [],
  );

  // ─── Right panel ───────────────────────────────────────────────────
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
          options={CUISINE_OPTIONS.map((option) => option.value)}
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

  const FOOTER_HEIGHT = 70 + insets.bottom;

  return (
    <View style={styles.root}>
      {/* Backdrop — native driver ✓ */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        />
      </TouchableWithoutFeedback>

      {/* Outer: translateY only — native driver ✓ */}
      <Animated.View
        style={[
          styles.sheetContainer,
          { transform: [{ translateY: sheetTranslateY }] },
        ]}
      >
        {/* Inner: height only — JS driver ✓ */}
        <Animated.View style={[styles.sheet, { height: sheetHeight }]}>
          {/* Drag target: handle + header */}
          <View {...panResponder.panHandlers}>
            <View style={styles.handleWrap}>
              <View style={styles.handle} />
            </View>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Filter</Text>
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <Feather name="x" size={18} color={colors.textMuted} />
              </Pressable>
            </View>
          </View>

          {/* Scrollable content — padded so it never hides behind footer */}
          <View style={[styles.content, { paddingBottom: FOOTER_HEIGHT }]}>
            <FilterSidebar
              items={sidebarItems}
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key)}
            />
            <View style={styles.rightPanel}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.rightPanelScrollContent}
              >
                {renderRightPanel()}
              </ScrollView>
            </View>
          </View>

          <View style={[styles.footer, { paddingBottom: 14 + insets.bottom }]}>
            <ActiveFiltersSummary
              category={category}
              sort={sort}
              cuisines={cuisines}
              rating={rating}
              distance={distance}
              customDistance={customDistance}
              onClearCategory={() =>
                useFilterStore.getState().setCategory(scope, "")
              }
              onClearSort={() => setSort(scope, "relevance")}
              onRemoveCuisine={(value) => toggleCuisine(scope, value)}
              onClearRating={() => setRating(scope, "")}
              onClearDistance={() => {
                setDistance(scope, "");
                setCustomDistance(scope, "");
              }}
            />
            <View style={styles.footerDivider} />
            <View style={styles.footerActions}>
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
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: "transparent",
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.68)",
    },
    // Outer wrapper — sits at the bottom, only moves on Y axis
    sheetContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    // Inner wrapper — changes height for snap points
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      overflow: "hidden",
    },
    handleWrap: {
      alignItems: "center",
      paddingTop: 10,
      paddingBottom: 6,
    },
    handle: {
      width: 46,
      height: 5,
      borderRadius: 999,
      backgroundColor: colors.border,
    },
    header: {
      minHeight: 52,
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
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      flex: 1,
      flexDirection: "row",
    },
    rightPanel: {
      flex: 1,
    },
    rightPanelScrollContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 16,
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    footerActions: {
      minHeight: 70,
      paddingHorizontal: 24,
      paddingTop: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
    },
    footerDivider: {
      height: 2,
      backgroundColor: colors.border,
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
}
