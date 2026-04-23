import { useFollowedBusinesses } from "@/src/features/following";
import { router } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import BusinessCard from "../../src/components/business/BusinessCard/BusinessCard";
import ScreenHeader from "../../src/components/common/ScreenHeader/ScreenHeader";
import AppLoader from "../../src/components/ui/AppLoader/AppLoader";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";

export default function FollowingScreen() {
  const { followedBusinesses, isLoading, isEmpty } = useFollowedBusinesses();

  if (isLoading) {
    return (
      <AppScreen withTopInset={false} style={styles.container}>
        <ScreenHeader title="Following" titleSubtitle="Businesses you follow" />
        <View style={styles.loaderWrap}>
          <AppLoader />
        </View>
      </AppScreen>
    );
  }

  if (isEmpty) {
    return (
      <AppScreen withTopInset={false} style={styles.container}>
        <ScreenHeader title="Following" titleSubtitle="Businesses you follow" />

        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No followed businesses yet</Text>
          <Text style={styles.emptyText}>
            Follow businesses from Home and they will appear here.
          </Text>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <ScreenHeader title="Following" titleSubtitle="Businesses you follow" />

      <FlatList
        data={followedBusinesses}
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
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
    textAlign: "center",
  },
});
