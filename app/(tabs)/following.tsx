import { AccountTypeSwitch } from "@/src/components/auth";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import FollowingFeedCard from "@/src/components/following/FollowingFeedCard";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { AppColors } from "@/src/constants/colors";
import { DISCOVERY_GRADIENT } from "@/src/constants/gradients";
import {
  DEFAULT_LOCATION_OPTIONS,
  LocationOption,
} from "@/src/constants/locations";
import { useFollowingFeed } from "@/src/features/following";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useFollowingLocationStore } from "@/src/store/following-location.store";
import { router } from "expo-router";
import React from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";

export default function FollowingScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const {
    label: selectedLocationLabel,
    setManualLocation,
    setNearbyLocation,
    setPermissionStatus,
  } = useFollowingLocationStore();

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
    router.push({
      pathname: "/modal/filter",
      params: { scope: "following" },
    });
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
          actions={["map", "filter"]}
          onPressMap={handleMapPress}
          onPressFilter={handleFilterPress}
          gradientColors={DISCOVERY_GRADIENT}
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
        actions={["map", "filter"]}
        onPressMap={handleMapPress}
        onPressFilter={handleFilterPress}
        gradientColors={DISCOVERY_GRADIENT}
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
        <AppEmptyState
          title="You are not following anyone yet"
          description="Follow businesses to see their promotions and news here."
        />
      ) : isEmpty ? (
        <AppEmptyState
          title={`No ${
            activeTab === "promotion" ? "promotions" : "news"
          } found`}
          description={
            activeTab === "promotion"
              ? "There are no promotions at this time. Check the News!"
              : "There is no news at this time. Check the Promotions!"
          }
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <FollowingFeedCard item={item} />}
        />
      )}
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
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
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 24,
    },
  });
}
