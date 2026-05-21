import BusinessCard from "@/src/components/business/BusinessCard/BusinessCard";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { apiClient } from "@/src/services/api/client";
import { ENDPOINTS } from "@/src/services/api/endpoints";
import type { Business } from "@/src/types/business";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SearchResultsScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ query?: string }>();

  const [query, setQuery] = useState(params.query ?? "");
  const [results, setResults] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get<Business[]>(
          `${ENDPOINTS.BUSINESSES}?search=${encodeURIComponent(query.trim())}`,
        );
        setResults(res.data);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <AppScreen withTopInset={false} style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 8, backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.textPrimary} />
        </Pressable>

        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={setQuery}
          placeholder="Find services, food or places"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.textPrimary }]}
          returnKeyType="search"
          clearButtonMode="while-editing"
          autoCapitalize="none"
        />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <AppLoader />
        </View>
      ) : results.length === 0 && query.trim().length > 0 ? (
        <View style={styles.center}>
          <AppText style={{ color: colors.textMuted }}>No results for "{query}"</AppText>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
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
        />
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  backBtn: {
    padding: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    padding: 16,
    gap: 12,
  },
});
