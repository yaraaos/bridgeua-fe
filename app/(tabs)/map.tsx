import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import CategoryScroller from "@/src/components/home/CategoryScroller/CategoryScroller";
import {
  MAP_MARKER_ANCHOR_Y,
  MapBusinessCallout,
  MapMarkerPin,
} from "@/src/components/map";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { HOME_CATEGORIES } from "@/src/constants/categories";
import {
  DEFAULT_LOCATION_OPTIONS,
  LocationOption,
} from "@/src/constants/locations";
import { useBusinesses } from "@/src/features/businesses";
import { useDiscoveryFeed } from "@/src/features/discovery/hooks/useDiscoveryFeed";
import { useDiscoveryLocationStore } from "@/src/store/discovery-location";
import { useFilterStore } from "@/src/store/filter.store";
import { useFollowingStore } from "@/src/store/following.store";
import { Business } from "@/src/types/business";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

const DEFAULT_REGION: Region = {
  latitude: 34.0549,
  longitude: -118.2426,
  latitudeDelta: 0.35,
  longitudeDelta: 0.35,
};

const FOCUSED_DELTA = 0.05;

export default function MapScreen() {
  const mapRef = useRef<MapView | null>(null);

  const {
    label: selectedLocationLabel,
    latitude: locationLatitude,
    longitude: locationLongitude,
    setManualLocation,
    setNearbyLocation,
    setPermissionStatus,
  } = useDiscoveryLocationStore();

  const { sort, cuisines, rating, distance, customDistance } = useFilterStore(
    (state) => state.discoveryFilters,
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (sort && sort !== "relevance") count += 1;
    if (cuisines.length > 0) count += cuisines.length;
    if (rating) count += 1;
    if (distance) count += 1;
    if (distance === "custom" && customDistance) count += 1;
    return count;
  }, [sort, cuisines, rating, distance, customDistance]);

  const followedBusinessIds = useFollowingStore(
    (state) => state.followedBusinessIds,
  );
  const { businesses, isLoading } = useBusinesses();

  const { filteredBusinesses } = useDiscoveryFeed({
    businesses,
    sort,
    cuisines,
    rating,
    distance,
    customDistance,
  });

  const initialRegion: Region = useMemo(() => {
    if (typeof locationLatitude === "number" && typeof locationLongitude === "number") {
      return {
        latitude: locationLatitude,
        longitude: locationLongitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }

    return DEFAULT_REGION;
  }, [locationLatitude, locationLongitude]);

  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(
    null,
  );

  const [loadedMarkerIds, setLoadedMarkerIds] = useState<Set<string>>(
    () => new Set(),
  );

  const handleMarkerImageLoad = (markerKey: string) => {
    setLoadedMarkerIds((prev) => {
      if (prev.has(markerKey)) return prev;
      const next = new Set(prev);
      next.add(markerKey);
      return next;
    });
  };

  const selectedBusiness: Business | undefined = useMemo(
    () => filteredBusinesses.find((business) => business.id === selectedBusinessId),
    [filteredBusinesses, selectedBusinessId],
  );

  const handleSelectLocationOption = (option: LocationOption) => {
    setManualLocation({ label: option.label, value: option.value });
  };

  const handleRequestNearby = () => {
    Alert.alert(
      "Use your location?",
      "Allow location access to find businesses near you.",
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

  const handleFilterPress = () => {
    router.push({
      pathname: "/modal/filter",
      params: { scope: "discovery" },
    });
  };

  const selectedCategory =
    cuisines.length === 0
      ? "All Categories"
      : cuisines[0] === "Automotive"
        ? "Auto"
        : cuisines[0];

  const handleSelectCategory = (category: string) => {
    setSelectedBusinessId(null);

    if (category === "All Categories") {
      useFilterStore.setState((state) => ({
        discoveryFilters: { ...state.discoveryFilters, cuisines: [] },
      }));
      return;
    }

    const mapped = category === "Auto" ? "Automotive" : category;

    useFilterStore.setState((state) => ({
      discoveryFilters: { ...state.discoveryFilters, cuisines: [mapped] },
    }));
  };

  const handleMarkerPress = (business: Business) => {
    setSelectedBusinessId(business.id);

    mapRef.current?.animateToRegion(
      {
        latitude: business.coordinates.latitude,
        longitude: business.coordinates.longitude,
        latitudeDelta: FOCUSED_DELTA,
        longitudeDelta: FOCUSED_DELTA,
      },
      300,
    );
  };

  const handleDetailsPress = (businessId: string) => {
    router.push({
      pathname: "/business/[id]",
      params: { id: String(businessId) },
    });
  };

  const header = (
    <ScreenHeader
      title="Map"
      titleSubtitle="Discover on the map"
      subtitleValue={selectedLocationLabel}
      showSubtitleChevron
      locationOptions={DEFAULT_LOCATION_OPTIONS}
      onSelectLocationOption={handleSelectLocationOption}
      onRequestNearby={handleRequestNearby}
      showSearch
      searchPlaceholder="Find on map"
      actions={["filter"]}
      onPressFilter={handleFilterPress}
      activeFilterCount={activeFilterCount}
    />
  );

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      {header}

      <View style={styles.categoryWrap}>
        <CategoryScroller
          categories={HOME_CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      </View>

      <View style={styles.mapWrap}>
        {isLoading ? (
          <View style={styles.loaderWrap}>
            <AppLoader />
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation
            showsMyLocationButton={false}
            onPress={() => setSelectedBusinessId(null)}
          >
            {filteredBusinesses.map((business) => {
              const isFollowed = followedBusinessIds.includes(
                String(business.id),
              );
              const markerKey = `${business.id}-${isFollowed ? "followed" : "unfollowed"}`;
              const isLoaded = loadedMarkerIds.has(markerKey);

              return (
                <Marker
                  key={markerKey}
                  coordinate={business.coordinates}
                  onPress={(event) => {
                    event.stopPropagation();
                    handleMarkerPress(business);
                  }}
                  anchor={{ x: 0.5, y: MAP_MARKER_ANCHOR_Y }}
                  tracksViewChanges={!isLoaded}
                >
                  <MapMarkerPin
                    imageUrl={business.image}
                    isFollowed={isFollowed}
                    onImageLoad={() => handleMarkerImageLoad(markerKey)}
                  />
                </Marker>
              );
            })}
          </MapView>
        )}

        {selectedBusiness ? (
          <View
            style={styles.calloutWrap}
            pointerEvents="box-none"
          >
            <MapBusinessCallout
              business={selectedBusiness}
              onClose={() => setSelectedBusinessId(null)}
              onPressDetails={() => handleDetailsPress(selectedBusiness.id)}
            />
          </View>
        ) : null}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  categoryWrap: {
    backgroundColor: "#F7F7F5",
  },
  mapWrap: {
    flex: 1,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  calloutWrap: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 16,
  },
});