import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import CategoryScroller from "@/src/components/home/CategoryScroller/CategoryScroller";
import {
  MAP_MARKER_ANCHOR_Y,
  MapBusinessCallout,
  MapMarkerPin,
} from "@/src/components/map";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import {
  DEFAULT_LOCATION_OPTIONS,
  LocationOption,
} from "@/src/constants/locations";
import { useBusinesses } from "@/src/features/businesses";
import { useCategories } from "@/src/features/categories/hooks/useCategories";
import { useDiscoveryFeed } from "@/src/features/discovery/hooks/useDiscoveryFeed";
import { useDiscoveryLocationStore } from "@/src/store/discovery-location";
import { useFilterStore } from "@/src/store/filter.store";
import { useFollowingStore } from "@/src/store/following.store";
import { Business } from "@/src/types/business";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapView, { MapMarkerProps, Marker, Region } from "react-native-maps";

const DEFAULT_REGION: Region = {
  latitude: 34.0549,
  longitude: -118.2426,
  latitudeDelta: 0.35,
  longitudeDelta: 0.35,
};

const FOCUSED_DELTA = 0.05;

type BusinessMarkerProps = {
  business: Business;
  isFollowed: boolean;
  onPress: NonNullable<MapMarkerProps["onPress"]>;
};

function BusinessMarker({
  business,
  isFollowed,
  onPress,
}: BusinessMarkerProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [followChangePending, setFollowChangePending] = useState(false);
  const isFirstFollowEffect = useRef(true);

  useEffect(() => {
    if (isFirstFollowEffect.current) {
      isFirstFollowEffect.current = false;
      return;
    }
    setFollowChangePending(true);
    const timer = setTimeout(() => setFollowChangePending(false), 120);
    return () => clearTimeout(timer);
  }, [isFollowed]);

  return (
    <Marker
      coordinate={business.coordinates}
      onPress={onPress}
      anchor={{ x: 0.5, y: MAP_MARKER_ANCHOR_Y }}
      tracksViewChanges={!imageLoaded || followChangePending}
    >
      <MapMarkerPin
        imageUrl={business.avatarUrl ?? business.image}
        isFollowed={isFollowed}
        onImageLoad={() => setImageLoaded(true)}
      />
    </Marker>
  );
}

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

  const { category, sort, cuisines, rating, distance, customDistance } =
    useFilterStore((state) => state.discoveryFilters);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (category) count += 1;
    if (sort && sort !== "relevance") count += 1;
    if (cuisines.length > 0) count += cuisines.length;
    if (rating) count += 1;
    if (distance) count += 1;
    if (distance === "custom" && customDistance) count += 1;
    return count;
  }, [category, sort, cuisines, rating, distance, customDistance]);

  const followedBusinessIds = useFollowingStore(
    (state) => state.followedBusinessIds,
  );
  const { businesses, isLoading } = useBusinesses();

  const { filteredBusinesses } = useDiscoveryFeed({
    businesses,
    category,
    sort,
    cuisines,
    rating,
    distance,
    customDistance,
  });

  const markerKeyPrefix = useMemo(
    () =>
      [
        category,
        sort,
        cuisines.join(","),
        rating,
        distance,
        customDistance,
      ].join("|"),
    [category, sort, cuisines, rating, distance, customDistance],
  );

  const mappableBusinesses = useMemo(() => {
    const seen = new Set<string>();
    const result: Business[] = [];

    for (const business of filteredBusinesses) {
      if (!business?.id) continue;

      const key = String(business.id);
      if (seen.has(key)) continue;

      const lat = business.coordinates?.latitude;
      const lng = business.coordinates?.longitude;

      if (typeof lat !== "number" || !Number.isFinite(lat)) continue;
      if (typeof lng !== "number" || !Number.isFinite(lng)) continue;

      seen.add(key);
      result.push(business);
    }

    return result;
  }, [filteredBusinesses]);

  const initialRegion: Region = useMemo(() => {
    if (
      typeof locationLatitude === "number" &&
      typeof locationLongitude === "number"
    ) {
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

  const selectedBusiness: Business | undefined = useMemo(
    () =>
      mappableBusinesses.find((business) => business.id === selectedBusinessId),
    [mappableBusinesses, selectedBusinessId],
  );

  useEffect(() => {
    if (selectedBusinessId && !selectedBusiness) {
      setSelectedBusinessId(null);
    }
  }, [selectedBusinessId, selectedBusiness]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mappableBusinesses.length === 0) return;

    if (mappableBusinesses.length === 1) {
      const only = mappableBusinesses[0].coordinates;
      mapRef.current.animateToRegion(
        {
          latitude: only.latitude,
          longitude: only.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        300,
      );
      return;
    }

    mapRef.current.fitToCoordinates(
      mappableBusinesses.map((business) => business.coordinates),
      {
        edgePadding: { top: 140, right: 56, bottom: 220, left: 56 },
        animated: true,
      },
    );
  }, [mappableBusinesses]);

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

  const { categories } = useCategories();
  const categoryNames = ["All Categories", ...categories.map((c) => c.name)];

  const selectedCategory = category || "All Categories";

  const handleSelectCategory = (selectedCategoryLabel: string) => {
    setSelectedBusinessId(null);
    const mappedCategory =
      selectedCategoryLabel === "All Categories" ? "" : selectedCategoryLabel;
    useFilterStore.getState().setCategory("discovery", mappedCategory);
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
            {mappableBusinesses.map((business) => {
              const isFollowed = followedBusinessIds.includes(
                String(business.id),
              );

              return (
                <BusinessMarker
                  key={`${markerKeyPrefix}-${String(business.id)}`}
                  business={business}
                  isFollowed={isFollowed}
                  onPress={(event) => {
                    event.stopPropagation();
                    handleMarkerPress(business);
                  }}
                />
              );
            })}
          </MapView>
        )}

        <View style={styles.categoryWrap} pointerEvents="box-none">
          <CategoryScroller
            categories={categoryNames}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            overlay
          />
        </View>

        {selectedBusiness ? (
          <View style={styles.calloutWrap} pointerEvents="box-none">
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
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
