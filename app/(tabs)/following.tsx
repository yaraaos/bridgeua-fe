import { AccountTypeSwitch } from "@/src/components/auth";
import { RatingBadge } from "@/src/components/common";
import { useFollowingFeed } from "@/src/features/following";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FollowButton from "../../src/components/business/FollowButton/FollowButton";
import ScreenHeader from "../../src/components/common/ScreenHeader/ScreenHeader";
import AppLoader from "../../src/components/ui/AppLoader/AppLoader";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import { colors } from "../../src/constants/colors";
import {
  DEFAULT_LOCATION_OPTIONS,
  LocationOption,
} from "../../src/constants/locations";
import { useLocationStore } from "../../src/store/location.store";

export default function FollowingScreen() {
  const {
    label: selectedLocationLabel,
    setManualLocation,
    setNearbyLocation,
    setPermissionStatus,
  } = useLocationStore();

  const handleSelectLocationOption = (option: LocationOption) => {
    setManualLocation({
      label: option.label,
      value: option.value,
    });
  };

  const handleRequestNearby = () => {
    Alert.alert(
      "Use your location?",
      "Allow location access to see followed businesses near you.",
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

  const handleMapPress = () => {
    console.log("Following map is not implemented yet");
  };

  const handleFilterPress = () => {
    router.push("/modal/filter");
  };

  const handleAddPress = () => {
    console.log("Add action pressed");
  };

  if (isLoading) {
    return (
      <AppScreen withTopInset={false} style={styles.container}>
        <ScreenHeader
          title="Following"
          titleSubtitle="Businesses you follow"
          subtitleLabel="Location"
          subtitleValue={selectedLocationLabel}
          showSubtitleChevron
          locationOptions={DEFAULT_LOCATION_OPTIONS}
          onSelectLocationOption={handleSelectLocationOption}
          onRequestNearby={handleRequestNearby}
          searchPlaceholder="Search here..."
          searchValue={searchQuery}
          onSearchChangeText={setSearchQuery}
          actions={["map", "filter", "add"]}
          onPressMap={handleMapPress}
          onPressFilter={handleFilterPress}
          onPressAdd={handleAddPress}
          gradientColors={["#F7D0A7", "#F2B277"]}
        />

        <View style={styles.switchWrap}>
          <AccountTypeSwitch
            options={[
              { label: "Promotions", value: "promotion" },
              { label: "News", value: "news" },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />
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
        subtitleValue={selectedLocationLabel}
        showSubtitleChevron
        locationOptions={DEFAULT_LOCATION_OPTIONS}
        onSelectLocationOption={handleSelectLocationOption}
        onRequestNearby={handleRequestNearby}
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

      <View style={styles.switchWrap}>
        <AccountTypeSwitch
          options={[
            { label: "Promotions", value: "promotion" },
            { label: "News", value: "news" },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />
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

                    <View style={styles.rightActions}>
                      <RatingBadge rating={item.businessRating} compact />
                      <FollowButton
                        businessId={String(item.businessId)}
                        size="sm"
                        variant="outline"
                      />
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
    backgroundColor: colors.background,
  },
  switchWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: "center",
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
    marginRight: 8,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
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
