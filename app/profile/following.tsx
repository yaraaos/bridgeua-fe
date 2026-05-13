import BusinessCard from "@/src/components/business/BusinessCard/BusinessCard";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { businessesMock } from "@/src/mocks/businesses.mock";
import { useFollowingStore } from "@/src/store/following.store";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

export default function ProfileFollowingScreen() {
  const followedBusinessIds = useFollowingStore(
    (state) => state.followedBusinessIds,
  );

  const [refreshing, setRefreshing] = useState(false);

  const followedBusinesses = useMemo(
    () =>
      businessesMock.filter((business) =>
        followedBusinessIds.includes(String(business.id)),
      ),
    [followedBusinessIds],
  );

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <ScreenHeader title="Following" titleSubtitle="Businesses you follow" />

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
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    paddingTop: 12,
    paddingBottom: 24,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  separator: {
    height: 12,
  },
});
