import BusinessCard from "@/src/components/business/BusinessCard/BusinessCard";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { AppColors } from "@/src/constants/colors";
import { useBusinesses } from "@/src/features/businesses";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const RECENT_SEARCHES_STORAGE_KEY = "recent-searches";

export default function SearchScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const { businesses } = useBusinesses();

  useEffect(() => {
    const loadRecentSearches = async () => {
      const savedSearches = await AsyncStorage.getItem(
        RECENT_SEARCHES_STORAGE_KEY,
      );

      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches));
      }
    };

    loadRecentSearches();
  }, []);

  const saveRecentSearch = async (value: string) => {
    const searchValue = value.trim();

    if (!searchValue) {
      return;
    }

    const updatedSearches = [
      searchValue,
      ...recentSearches.filter((item) => item !== searchValue),
    ].slice(0, 10);

    setRecentSearches(updatedSearches);

    await AsyncStorage.setItem(
      RECENT_SEARCHES_STORAGE_KEY,
      JSON.stringify(updatedSearches),
    );
  };

  const removeRecentSearch = async (value: string) => {
    const updatedSearches = recentSearches.filter((item) => item !== value);

    setRecentSearches(updatedSearches);

    await AsyncStorage.setItem(
      RECENT_SEARCHES_STORAGE_KEY,
      JSON.stringify(updatedSearches),
    );
  };

  const clearRecentSearches = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
  };

  const filteredBusinesses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return businesses.filter((business) => {
      const searchableText = [
        business.name,
        business.category,
        business.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText
        .split(" ")
        .some((word) => word.startsWith(normalizedQuery));
    });
  }, [businesses, query]);

  const handleSearchChange = (value: string) => {
    setQuery(value);
  };

  const handleRecentSearchPress = (value: string) => {
    setQuery(value);
    saveRecentSearch(value);
  };

  const handleBusinessPress = (businessId: string) => {
    saveRecentSearch(query);

    router.push({
      pathname: "/business/[id]",
      params: { id: businessId },
    });
  };

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <ScreenHeader
        title="Search"
        onBack={() => router.back()}
        showSearch
        searchAutoFocus
        searchPlaceholder="Find services, food or places"
        searchValue={query}
        onSearchChangeText={handleSearchChange}
      />

      <View style={styles.content}>
        {!query.trim() ? (
          recentSearches.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent searches</Text>

                <Pressable onPress={clearRecentSearches}>
                  <Text style={styles.clearAll}>Clear all</Text>
                </Pressable>
              </View>

              <View style={styles.chips}>
                {recentSearches.map((item) => (
                  <View key={item} style={styles.chip}>
                    <Pressable onPress={() => handleRecentSearchPress(item)}>
                      <Text style={styles.chipText}>{item}</Text>
                    </Pressable>

                    <Pressable onPress={() => removeRecentSearch(item)}>
                      <Feather name="x" size={14} color={colors.textMuted} />
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          ) : null
        ) : filteredBusinesses.length === 0 ? (
          <View style={styles.emptyWrap}>
            <AppEmptyState
              title={`No results for "${query}"`}
              description="Try searching by business name, category, or location."
            />
          </View>
        ) : (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          >
            {filteredBusinesses.map((item) => (
              <BusinessCard
                key={String(item.id)}
                business={item}
                onPress={() => handleBusinessPress(String(item.id))}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      padding: 0,
    },

    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
    },

    section: {
      gap: 12,
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textPrimary,
    },

    clearAll: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.primaryGreen,
    },

    chips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },

    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 999,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },

    chipText: {
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: "500",
    },

    list: {
      gap: 12,
      paddingBottom: 24,
    },

    emptyWrap: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: 80,
    },
  });
}
