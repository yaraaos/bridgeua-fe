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
    StyleSheet,
    Text,
    View,
} from "react-native";

const GALLERY_FULL_HEIGHT = 220;
const GALLERY_COLLAPSED_HEIGHT = 0;
const GALLERY_COLLAPSE_DISTANCE = 160;

export default function BusinessDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { business, isLoading } = useBusinessDetails(id);
  const [activeTab, setActiveTab] = useState<BusinessDetailsTab>("overview");
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [canFullyCollapseGallery, setCanFullyCollapseGallery] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const canCollapseGallery = canFullyCollapseGallery;

  const galleryHeight = canCollapseGallery
    ? scrollY.interpolate({
        inputRange: [0, GALLERY_COLLAPSE_DISTANCE],
        outputRange: [GALLERY_FULL_HEIGHT, GALLERY_COLLAPSED_HEIGHT],
        extrapolate: "clamp",
      })
    : GALLERY_FULL_HEIGHT;

  const galleryOpacity = canCollapseGallery
    ? scrollY.interpolate({
        inputRange: [0, GALLERY_COLLAPSE_DISTANCE],
        outputRange: [1, 0],
        extrapolate: "clamp",
      })
    : 1;

  const handleContentSizeChange = (_: number, contentHeight: number) => {
    if (!scrollViewHeight) {
      return;
    }

    const maxScrollDistance = contentHeight - scrollViewHeight;

    setCanFullyCollapseGallery(maxScrollDistance >= GALLERY_COLLAPSE_DISTANCE);
  };

  const handleChangeTab = (tab: BusinessDetailsTab) => {
    setActiveTab(tab);
    setCanFullyCollapseGallery(false);
    scrollY.setValue(0);
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
          <FollowButton businessId={business.id} size="sm" variant="filled" />
        }
      />

      <Animated.ScrollView
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onLayout={(event) =>
          setScrollViewHeight(event.nativeEvent.layout.height)
        }
        onContentSizeChange={handleContentSizeChange}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        <Animated.View
          style={[
            styles.galleryCollapseWrap,
            {
              height: galleryHeight,
              opacity: galleryOpacity,
            },
          ]}
        >
          <BusinessHeroGallery
            images={business.images}
            onPressImage={(imageId) => console.log("Open image", imageId)}
            onPressViewAll={() => console.log("Open all photos")}
          />
        </Animated.View>

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

        <View style={styles.placeholderSection}>
          <Text style={styles.sectionTitle}>Business details content next</Text>
        </View>
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
  placeholderSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
});
