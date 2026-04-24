import { AccountTypeSwitch } from "@/src/components/auth";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import FollowingFeedCard from "@/src/components/following/FollowingFeedCard";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { colors } from "@/src/constants/colors";
import {
  DEFAULT_LOCATION_OPTIONS,
  LocationOption,
} from "@/src/constants/locations";
import { useFollowingFeed } from "@/src/features/following";
import { useFollowingLocationStore } from "@/src/store/following-location.store";
import { router } from "expo-router";
import React from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";

export default function FollowingScreen() {
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
        <AppEmptyState
          title="You are not following anyone yet"
          description="Follow businesses to see their promotions and news here."
        />
      ) : isEmpty ? (
        <AppEmptyState
          title={`No ${
            activeTab === "promotion" ? "promotions" : "news"
          } found`}
          description="Try another search or switch tabs."
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
});
