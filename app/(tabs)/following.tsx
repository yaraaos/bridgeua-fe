import { useFollowingFeed } from "@/src/features/following";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ScreenHeader from "../../src/components/common/ScreenHeader/ScreenHeader";
import AppLoader from "../../src/components/ui/AppLoader/AppLoader";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import { colors } from "../../src/constants/colors";

export default function FollowingScreen() {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    items,
    isLoading,
    isEmpty,
    hasFollowedBusinesses,
  } = useFollowingFeed();
  const handleFilterPress = () => {
    router.push("/modal/filter");
  };
  const handleAddPress = () => {
    console.log("Add action pressed");
  };
  const handleMapPress = () => {
    console.log("Following map is not implemented yet");
  };

  if (isLoading) {
    return (
      <AppScreen withTopInset={false} style={styles.container}>
        <ScreenHeader
          title="Following"
          titleSubtitle="Businesses you follow"
          subtitleLabel="Location"
          subtitleValue="California, USA"
          showSubtitleChevron
          showSearch
          searchPlaceholder="Search here..."
          searchValue={searchQuery}
          onSearchChangeText={setSearchQuery}
          actions={["map", "filter", "add"]}
          onPressMap={handleMapPress}
          onPressFilter={handleFilterPress}
          onPressAdd={handleAddPress}
          gradientColors={["#F7D0A7", "#F2B277"]}
        />

        <View style={styles.tabsRow}>
          <Pressable
            style={[
              styles.tabButton,
              activeTab === "promotion" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("promotion")}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "promotion" && styles.tabButtonTextActive,
              ]}
            >
              Promotions
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tabButton,
              activeTab === "news" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("news")}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "news" && styles.tabButtonTextActive,
              ]}
            >
              News
            </Text>
          </Pressable>
        </View>

        <View style={styles.loaderWrap}>
          <AppLoader />
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <ScreenHeader
        title="Following"
        titleSubtitle="Businesses you follow"
        subtitleLabel="Location"
        subtitleValue="California, USA"
        showSubtitleChevron
        showSearch
        searchPlaceholder="Search here..."
        searchValue={searchQuery}
        onSearchChangeText={setSearchQuery}
        actions={["map", "filter", "add"]}
        onPressMap={handleMapPress}
        onPressFilter={handleFilterPress}
        onPressAdd={handleAddPress}
        gradientColors={["#F7D0A7", "#F2B277"]}
      />

      <View style={styles.tabsRow}>
        <Pressable
          style={[
            styles.tabButton,
            activeTab === "promotion" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("promotion")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "promotion" && styles.tabButtonTextActive,
            ]}
          >
            Promotions
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.tabButton,
            activeTab === "news" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("news")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "news" && styles.tabButtonTextActive,
            ]}
          >
            News
          </Text>
        </Pressable>
      </View>

      {!hasFollowedBusinesses ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>
            You are not following anyone yet
          </Text>
          <Text style={styles.emptyText}>
            Follow businesses from Home to see their promotions and news here.
          </Text>
        </View>
      ) : isEmpty ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>
            No {activeTab === "promotion" ? "promotions" : "news"} found
          </Text>
          <Text style={styles.emptyText}>
            Try another search or switch tabs.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              style={styles.feedCard}
              onPress={() =>
                router.push({
                  pathname: "/business/[id]",
                  params: { id: String(item.businessId) },
                })
              }
            >
              <View style={styles.feedCardTop}>
                <Image
                  source={{ uri: item.businessImage }}
                  style={styles.businessImage}
                />

                <View style={styles.feedCardInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.businessName} numberOfLines={1}>
                      {item.businessName}
                    </Text>

                    <View style={styles.ratingWrap}>
                      <Text style={styles.ratingStar}>★</Text>
                      <Text style={styles.ratingText}>
                        {item.businessRating.toFixed(1)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.metaText} numberOfLines={1}>
                    {item.businessCategory}
                  </Text>

                  <Text style={styles.metaText} numberOfLines={1}>
                    {item.businessLocation}
                  </Text>

                  {!!item.recommendedBy && (
                    <Text style={styles.recommendedText} numberOfLines={1}>
                      {item.recommendedBy}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.feedBody}>
                <Text style={styles.feedTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.feedDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: colors.background || "#F5F4F1",
  },
  loaderWrap: {
    flex: 1,
    justifyContent: "center",
  },
  tabsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  tabButton: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: "#25684A",
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.white,
  },
  tabButtonTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
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
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: "center",
  },
  feedCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    marginBottom: 10,
  },
  feedCardTop: {
    flexDirection: "row",
    gap: 10,
  },
  businessImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  feedCardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  businessName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  ratingWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingStar: {
    fontSize: 12,
    color: "#7B8F7A",
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#7B8F7A",
  },
  metaText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 1,
  },
  recommendedText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  feedBody: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F1F1",
  },
  feedTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  feedDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },
});
