import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import CategoryScroller from "@/src/components/home/CategoryScroller/CategoryScroller";
import {
  MAP_MARKER_ANCHOR_Y,
  MapBusinessCallout,
  MapMarkerPin,
} from "@/src/components/map";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { PROMO_CATEGORY_LABEL } from "@/src/constants/categories";
import { US_STATE_BOUNDS } from "@/src/constants/stateBounds";
import { LocationOption } from "@/src/constants/locations";
import type { AuthUser } from "@/src/features/auth/types/auth.types";
import { useBusinesses } from "@/src/features/businesses";
import { getBusinessStates } from "@/src/features/businesses/services/business.service";
import { useCategories } from "@/src/features/categories/hooks/useCategories";
import { useDiscoveryFeed } from "@/src/features/discovery/hooks/useDiscoveryFeed";
import {
  isOwnedBusiness,
  prioritizeOwnedBusiness,
} from "@/src/features/discovery/utils/ownedBusinessDiscovery";
import { usePromotions } from "@/src/features/promotions/hooks/usePromotions";
import { useAccountStore, useActiveAccount } from "@/src/store/account.store";
import { useAuthStore } from "@/src/store/auth.store";
import { useDiscoveryLocationStore } from "@/src/store/discovery-location";
import { useFilterStore } from "@/src/store/filter.store";
import { useAppStore } from "@/src/store/app.store";
import { useFollowingStore } from "@/src/store/following.store";
import { Business } from "@/src/types/business";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
  isOwned?: boolean;
  onPress: NonNullable<MapMarkerProps["onPress"]>;
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function BusinessMarker({
  business,
  isFollowed,
  isOwned = false,
  onPress,
}: BusinessMarkerProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [stylingChangePending, setStylingChangePending] = useState(false);
  const isFirstStylingEffect = useRef(true);

  useEffect(() => {
    if (isFirstStylingEffect.current) {
      isFirstStylingEffect.current = false;
      return;
    }
    setStylingChangePending(true);
    const timer = setTimeout(() => setStylingChangePending(false), 120);
    return () => clearTimeout(timer);
  }, [isFollowed, isOwned]);

  return (
    <Marker
      coordinate={business.coordinates}
      onPress={onPress}
      anchor={{ x: 0.5, y: MAP_MARKER_ANCHOR_Y }}
      tracksViewChanges={!imageLoaded || stylingChangePending}
      zIndex={isOwned ? 10 : 1}
    >
      <MapMarkerPin
        imageUrl={business.avatarUrl ?? business.image}
        isFollowed={isFollowed}
        isOwned={isOwned}
        onImageLoad={() => setImageLoaded(true)}
      />
    </Marker>
  );
}

export default function MapScreen() {
  const { t } = useTranslation();
  const mapRef = useRef<MapView | null>(null);

  const [locationOptions, setLocationOptions] = useState<LocationOption[]>([
    { label: t("home.locationSeeNearby"), value: "nearby", type: "nearby" },
  ]);

  useEffect(() => {
    getBusinessStates().then((states) => {
      const stateOptions: LocationOption[] = states.map((s) => ({
        label: `${s}, USA`,
        value: s.toLowerCase().replace(/\s+/g, '-') + '-usa',
        type: 'manual',
        state: s,
      }));
      setLocationOptions([
        { label: t("home.locationAllLocations"), value: "all", type: "manual", state: undefined },
        { label: t("home.locationSeeNearby"), value: "nearby", type: "nearby" },
        ...stateOptions,
      ]);
    }).catch(() => {});
  }, [t]);

  const {
    label: selectedLocationLabel,
    state: locationState,
    latitude: locationLatitude,
    longitude: locationLongitude,
    permissionStatus,
    setManualLocation,
    setNearbyLocation,
    setPermissionStatus,
  } = useDiscoveryLocationStore();

  const { category, sort, cuisines, rating, distance } =
    useFilterStore((state) => state.discoveryFilters);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (category) count += 1;
    if (sort && sort !== "relevance") count += 1;
    if (cuisines.length > 0) count += cuisines.length;
    if (rating) count += 1;
    if (distance) count += 1;
    return count;
  }, [category, sort, cuisines, rating, distance]);

  const followedBusinessIds = useFollowingStore(
    (state) => state.followedBusinessIds,
  );
  const businessVersion = useFilterStore((s) => s.businessVersion);
  const businessesVersion = useAppStore((s) => s.businessesVersion);

  const { businesses, isLoading } = useBusinesses(
    locationState ? { state: locationState } : undefined,
    businessVersion + businessesVersion,
  );

  const currentUser = useAuthStore((state) => state.user);
  const activeAccount = useActiveAccount();
  const isHydrated = useAccountStore((s) => s.isHydrated);
  // Same FE fallback as Home until BU-198 (BE ownership metadata) lands.
  const effectiveUser = useMemo<AuthUser | null>(() => {
    if (!isHydrated || activeAccount?.kind !== "business") return currentUser;

    const fallbackOwnedId = activeAccount.ownedBusinessId;
    const matchedUser =
      currentUser && String(currentUser.id) === String(activeAccount.id)
        ? currentUser
        : null;
    const base = matchedUser ?? ({ id: activeAccount.id, email: "" } as AuthUser);

    return {
      ...base,
      accountType: "business",
      activeBusinessId: fallbackOwnedId ?? null,
      ownedBusinessIds: fallbackOwnedId ? [fallbackOwnedId] : [],
    };
  }, [currentUser, activeAccount, isHydrated]);

  const { promotions: activePromotions } = usePromotions();
  const businessIdsWithPromo = useMemo(() => {
    const followedSet = new Set(followedBusinessIds.map(String));
    return activePromotions
      .map((p) => String(p.businessId))
      .filter((id) => followedSet.has(id));
  }, [activePromotions, followedBusinessIds]);

  const { filteredBusinesses } = useDiscoveryFeed({
    businesses,
    category,
    sort,
    cuisines,
    rating,
    distance,
    businessIdsWithPromo,
  });

  const markerKeyPrefix = useMemo(
    () =>
      [
        category,
        sort,
        cuisines.join(","),
        rating,
        distance,
      ].join("|"),
    [category, sort, cuisines, rating, distance],
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

  const selectedHomeCategory = category;

  const prioritizedMappableBusinesses = useMemo(
    () =>
      prioritizeOwnedBusiness(
        mappableBusinesses,
        selectedHomeCategory,
        effectiveUser,
      ),
    [mappableBusinesses, selectedHomeCategory, effectiveUser],
  );

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
    if (locationState) return;
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
  }, [locationState, mappableBusinesses]);

  useEffect(() => {
    if (!locationState || !mapRef.current) return;
    setSelectedBusinessId(null);
    const bounds = US_STATE_BOUNDS[locationState];
    if (!bounds) return;
    mapRef.current.animateToRegion(bounds, 500);
  }, [locationState]);

  const handleSelectLocationOption = (option: LocationOption) => {
    setManualLocation({
      label: option.label,
      value: option.value,
      state: option.value === "all" ? undefined : option.state,
    });
  };

  const handleRequestNearby = useCallback(() => {
    Alert.alert(
      t("home.locationPermissionTitle"),
      t("home.locationPermissionMessage"),
      [
        {
          text: t("home.locationPermissionNotNow"),
          style: "cancel",
          onPress: () => setPermissionStatus("denied"),
        },
        {
          text: t("home.locationPermissionAllow"),
          onPress: () => {
            setPermissionStatus("granted");
            setNearbyLocation({
              label: t("home.locationNearYou"),
              value: "nearby",
              latitude: 34.0549,
              longitude: -118.2426,
            });
          },
        },
      ],
    );
  }, [setPermissionStatus, setNearbyLocation, t]);

  useFocusEffect(
    useCallback(() => {
      if (permissionStatus === "unknown") {
        handleRequestNearby();
      }
    }, [permissionStatus, handleRequestNearby]),
  );

  const handleFilterPress = () => {
    router.push({
      pathname: "/modal/filter",
      params: { scope: "discovery" },
    });
  };

  const isGuest = useAuthStore((state) => state.isGuest);
  const isBusinessAccount = effectiveUser?.accountType === "business";
  const canUsePromoFilter = !isBusinessAccount && !isGuest;

  const { categories } = useCategories();
  const categoryItems = [
    { label: t("home.allCategories"), value: "" },
    ...(canUsePromoFilter ? [{ label: t("categories.promo"), value: PROMO_CATEGORY_LABEL }] : []),
    ...categories.map((c) => ({ label: t(`categories.${c.slug}`, { defaultValue: c.name }), value: c.name })),
  ];

  const selectedCategory = category;

  const handleSelectCategory = (value: string) => {
    setSelectedBusinessId(null);
    useFilterStore.getState().setCategory("discovery", value);
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
      title={t("map.title")}
      titleSubtitle={t("map.subtitle")}
      subtitleValue={selectedLocationLabel}
      showSubtitleChevron
      locationOptions={locationOptions}
      onSelectLocationOption={handleSelectLocationOption}
      onRequestNearby={handleRequestNearby}
      showSearch
      searchPlaceholder={t("map.searchPlaceholder")}
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
            {prioritizedMappableBusinesses.map((business) => {
              const isFollowed = followedBusinessIds.includes(
                String(business.id),
              );
              const isOwned = isOwnedBusiness(business, effectiveUser);

              return (
                <BusinessMarker
                  key={`${markerKeyPrefix}-${String(business.id)}`}
                  business={business}
                  isFollowed={isFollowed}
                  isOwned={isOwned}
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
            categories={categoryItems}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            overlay
          />
        </View>

        {selectedBusiness ? (
          <View style={styles.calloutWrap} pointerEvents="box-none">
            <MapBusinessCallout
              business={{
                ...selectedBusiness,
                distanceKm:
                  typeof locationLatitude === "number" &&
                  typeof locationLongitude === "number" &&
                  typeof selectedBusiness.coordinates?.latitude === "number" &&
                  typeof selectedBusiness.coordinates?.longitude === "number"
                    ? parseFloat(
                        haversineKm(
                          locationLatitude,
                          locationLongitude,
                          selectedBusiness.coordinates.latitude,
                          selectedBusiness.coordinates.longitude,
                        ).toFixed(1),
                      )
                    : null,
              }}
              onClose={() => setSelectedBusinessId(null)}
              onPressDetails={() => handleDetailsPress(selectedBusiness.id)}
              isOwned={isOwnedBusiness(selectedBusiness, effectiveUser)}
              isBusinessAccount={effectiveUser?.accountType === "business"}
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
