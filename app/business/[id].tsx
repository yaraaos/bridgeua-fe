import {
  BusinessAboutSection,
  BusinessBookingCard,
  BusinessDetailsTabs,
  BusinessHeroGallery,
  BusinessOverviewCard,
  BusinessRatingSummary,
  BusinessReviewsList,
  BusinessServicesList,
  BusinessTopReviews,
  FollowButton,
  type BusinessDetailsTab,
} from "@/src/components/business";
import BusinessGalleryGrid from "@/src/components/business/BusinessGalleryGrid";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { AppColors } from "@/src/constants/colors";
import { DISCOVERY_GRADIENT } from "@/src/constants/gradients";
import { spacing } from "@/src/constants/spacing";
import { useBusinessDetails } from "@/src/features/businesses/hooks/useBusiness";
import { useReviews } from "@/src/features/reviews/hooks/useReviews";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function BusinessDetailsScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { id, tab } = useLocalSearchParams<{ id: string; tab?: string }>();
  useEffect(() => {
    if (tab === "photos") {
      setActiveTab("photos");
    }
  }, [tab]);

  const { business, isLoading } = useBusinessDetails(id);
  const {
    reviews,
    reviewCount,
    isLoading: areReviewsLoading,
  } = useReviews({
    businessId: id,
  });
  const [activeTab, setActiveTab] = useState<BusinessDetailsTab>("overview");

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const contentOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    contentOpacity.setValue(0);

    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [activeTab, contentOpacity]);

  const stickyIndex = activeTab === "photos" ? 0 : 1;

  const handleChangeTab = (tab: BusinessDetailsTab) => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    scrollY.setValue(0);
    setActiveTab(tab);
  };

  const [focusedReviewId, setFocusedReviewId] = useState<string | null>(null);

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

  const heroPhotos =
    business.images.length > 0 ? business.images : business.reviewPhotos;

  const openImageViewer = (
    index: number,
    options?: {
      overlayIndex?: number;
      overlayText?: string;
      businessId?: string;
    },
  ) => {
    router.push({
      pathname: "/modal/image-viewer",
      params: {
        images: JSON.stringify(heroPhotos.map(({ id, url }) => ({ id, url }))),
        initialIndex: String(index),
        overlayIndex:
          options?.overlayIndex !== undefined
            ? String(options.overlayIndex)
            : undefined,
        overlayText: options?.overlayText,
        businessId: options?.businessId,
      },
    });
  };

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
        stickyHeaderIndices={[stickyIndex]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        {activeTab !== "photos" ? (
          <View style={styles.galleryCollapseWrap}>
            <BusinessHeroGallery
              images={heroPhotos}
              onPressImage={(imageId) => {
                const imageIndex = heroPhotos.findIndex(
                  (image) => image.id === imageId,
                );

                openImageViewer(imageIndex >= 0 ? imageIndex : 0, {
                  overlayIndex: heroPhotos.length - 1,
                  overlayText: "View all",
                  businessId: business.id,
                });
              }}
              onPressViewAll={() => handleChangeTab("photos")}
            />
          </View>
        ) : null}

        <View style={styles.stickyTabsWrap}>
          <BusinessDetailsTabs
            activeTab={activeTab}
            onChange={handleChangeTab}
          />
        </View>
        <Animated.View style={{ opacity: contentOpacity }}>
          {activeTab === "overview" ? (
            <>
              <BusinessOverviewCard business={business} />
              <BusinessBookingCard businessId={business.id} />
              <BusinessTopReviews
                reviews={business.topReviews}
                reviewCount={business.reviewCount}
                onPressViewAll={() => {
                  setFocusedReviewId(null);
                  handleChangeTab("reviews");
                }}
                onPressReviewMore={(reviewId) => {
                  setFocusedReviewId(reviewId);
                  handleChangeTab("reviews");
                }}
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
            <>
              <BusinessRatingSummary
                rating={business.rating}
                reviewCount={business.reviewCount}
                breakdown={business.ratingBreakdown}
              />

              <BusinessReviewsList
                reviews={reviews}
                reviewCount={
                  areReviewsLoading ? business.reviewCount : reviewCount
                }
                reviewPhotos={business.reviewPhotos}
                focusedReviewId={focusedReviewId}
                onClearFocusedReview={() => setFocusedReviewId(null)}
                onPressWriteReview={(rating) =>
                  router.push({
                    pathname: "/business/write-review",
                    params: {
                      businessId: business.id,
                      rating: rating ? String(rating) : undefined,
                    },
                  })
                }
              />
            </>
          ) : null}
          {activeTab === "photos" ? (
            <BusinessGalleryGrid
              businessPhotos={business.images}
              reviewPhotos={business.reviewPhotos}
            />
          ) : null}

          {activeTab === "about" ? (
            <BusinessAboutSection
              businessName={business.name}
              about={business.about}
            />
          ) : null}
        </Animated.View>
      </Animated.ScrollView>
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
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
}
