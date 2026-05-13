import BusinessCard from "@/src/components/business/BusinessCard/BusinessCard";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { spacing } from "@/src/constants/spacing";
import { useBusinesses } from "@/src/features/businesses";
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

  const [visibleBusinessIds, setVisibleBusinessIds] = useState<string[]>([]);

  useEffect(() => {
    setVisibleBusinessIds(followedBusinessIds.map(String));
  }, []);

  const followedBusinesses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return businesses.filter((business) => {
      const isVisible = visibleBusinessIds.includes(String(business.id));

      const matchesSearch =
        business.name.toLowerCase().includes(normalizedSearch) ||
        business.category.toLowerCase().includes(normalizedSearch) ||
        business.location.toLowerCase().includes(normalizedSearch);

      return isVisible && matchesSearch;
    });
  }, [businesses, visibleBusinessIds, search]);

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
