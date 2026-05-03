import {
    BusinessBookingCard,
    BusinessDetailsTabs,
    BusinessHeroGallery,
    BusinessOverviewCard,
    BusinessReviewsList,
    BusinessServicesList,
    BusinessTopReviews,
    FollowButton,
    type BusinessDetailsTab,
} from "@/src/components/business";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { colors } from "@/src/constants/colors";
import { DISCOVERY_GRADIENT } from "@/src/constants/gradients";
import { spacing } from "@/src/constants/spacing";
import { useBusinessDetails } from "@/src/features/businesses/hooks/useBusiness";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function BusinessDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { business, isLoading } = useBusinessDetails(id);
  const [activeTab, setActiveTab] = useState<BusinessDetailsTab>("overview");

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const handleChangeTab = (tab: BusinessDetailsTab) => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    scrollY.setValue(0);
    setActiveTab(tab);
  };

  if (isLoading) {
    return (
      <AppScreen style={styles.center}>
        <ActivityIndicator />
      </AppScreen>
    );
  }

  if (!business) {
    return (
      <AppScreen style={styles.center}>
        <Text>Business not found</Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <ScreenHeader
        variant="business"
        title={business.name}
        imageUrl={business.images[0]?.url}
        rating={business.rating}
        reviewCount={business.reviewCount}
        category={business.category}
        location={business.location}
        isOpen={business.isOpen}
        closesAt={business.closesAt}
        gradientColors={DISCOVERY_GRADIENT}
        onPressShare={() => console.log("Share business", business.id)}
        rightSlot={
          <FollowButton businessId={business.id} size="icon" variant="soft" />
        }
      />

      <Animated.ScrollView
        ref={scrollViewRef}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.galleryCollapseWrap}>
          <BusinessHeroGallery
            images={business.images}
            onPressImage={(imageId) => console.log("Open image", imageId)}
            onPressViewAll={() => console.log("Open all photos")}
          />
        </View>

        <View style={styles.stickyTabsWrap}>
          <BusinessDetailsTabs
            activeTab={activeTab}
            onChange={handleChangeTab}
          />
        </View>

        {activeTab === "overview" ? (
          <>
            <BusinessOverviewCard business={business} />
            <BusinessBookingCard businessId={business.id} />
            <BusinessTopReviews
              reviews={business.topReviews}
              reviewCount={business.reviewCount}
              onPressViewAll={() => setActiveTab("reviews")}
            />
          </>
        ) : null}

        {activeTab === "services" ? (
          <BusinessServicesList
            services={business.services}
            onPressService={(serviceId) =>
              router.push({
                pathname: "/bookings/choose-service",
                params: {
                  businessId: business.id,
                  serviceId,
                },
              })
            }
          />
        ) : null}

        {activeTab === "reviews" ? (
          <BusinessReviewsList
            reviews={business.topReviews}
            reviewCount={business.reviewCount}
          />
        ) : null}
      </Animated.ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  galleryCollapseWrap: {
    overflow: "hidden",
    backgroundColor: colors.background,
  },
  stickyTabsWrap: {
    backgroundColor: colors.background,
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
});
