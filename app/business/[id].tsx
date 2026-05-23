import {
  BusinessAboutSection,
  BusinessBookingCard,
  BusinessDetailsTabs,
  BusinessHeroGallery,
  BusinessOverviewCard,
  BusinessRatingSummary,
  BusinessRecommendedByPreview,
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
import {
  AuthRequiredModal,
  GuestBusinessCtaBanner,
  useRequireAuth,
} from "@/src/features/auth";
import { useBusinessDetails } from "@/src/features/businesses/hooks/useBusiness";
import type {
  BusinessDetailsReview,
  BusinessRecommendation,
} from "@/src/features/businesses/types/business.types";
import { useReviews } from "@/src/features/reviews/hooks/useReviews";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useAuthStore } from "@/src/store/auth.store";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";

const TOP_REVIEWS_LIMIT = 3;

function getTopReviews(reviews: BusinessDetailsReview[]) {
  return [...reviews]
    .filter((review) => review.text.trim().length > 0)
    .sort((a, b) => {
      const ratingDifference = b.rating - a.rating;

      if (ratingDifference !== 0) {
        return ratingDifference;
      }

      const textLengthDifference = b.text.trim().length - a.text.trim().length;

      if (textLengthDifference !== 0) {
        return textLengthDifference;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, TOP_REVIEWS_LIMIT);
}

export default function BusinessDetailsScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { isAuthModalVisible, closeAuthModal, confirmAuthModal, requireAuth } =
    useRequireAuth();

  const isGuest = useAuthStore((state) => state.isGuest);

  const {
    id,
    tab,
    focusedReviewId: focusedReviewIdParam,
  } = useLocalSearchParams<{
    id?: string;
    tab?: string;
    focusedReviewId?: string;
  }>();

  const [activeTab, setActiveTab] = useState<BusinessDetailsTab>("overview");
  const [focusedReviewId, setFocusedReviewId] = useState<string | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const reviewsSectionYRef = useRef(0);
  const reviewsListYRef = useRef(0);

  const { business, isLoading } = useBusinessDetails(id);

  const {
    reviews,
    reviewCount,
    summary: reviewsSummary,
  } = useReviews({
    businessId: id,
  });

  useEffect(() => {
    if (tab === "reviews") {
      setActiveTab("reviews");

      if (focusedReviewIdParam) {
        setFocusedReviewId(focusedReviewIdParam);
      }

      return;
    }

    if (tab === "photos") {
      setActiveTab("photos");
      return;
    }

    if (tab === "about") {
      setActiveTab("about");
      return;
    }

    if (tab === "services") {
      setActiveTab("services");
    }
  }, [tab, focusedReviewIdParam]);

  useEffect(() => {
    if (activeTab !== "reviews" || !focusedReviewId) {
      return;
    }

    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: reviewsSectionYRef.current + reviewsListYRef.current,
        animated: true,
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [activeTab, focusedReviewId, reviews.length]);

  useEffect(() => {
    contentOpacity.setValue(0);

    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [activeTab, contentOpacity]);

  const stickyIndex = activeTab === "photos" ? 0 : 1;

  const handleChangeTab = (nextTab: BusinessDetailsTab) => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    scrollY.setValue(0);
    setActiveTab(nextTab);
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

  const heroPhotos =
    business.images.length > 0 ? business.images : business.reviewPhotos;

  const allReviewPhotos = reviews.flatMap((review) => review.photos ?? []);

  const handleShareBusiness = async () => {
    try {
      await Share.share({
        message: `Check out ${business.name} on BridgeUA\nhttps://bridgeua.app/business/${business.id}`,
      });
    } catch (error) {
      console.error("Share failed", error);
    }
  };

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

  const topReviews = getTopReviews(reviews);

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <ScreenHeader
        variant="business"
        title={business.name}
        imageUrl={business.images[0]?.url}
        rating={reviewsSummary?.rating ?? business.rating}
        reviewCount={reviewsSummary?.reviewCount ?? reviewCount}
        category={business.category}
        location={business.location}
        isOpen={business.isOpen}
        closesAt={business.closesAt}
        gradientColors={DISCOVERY_GRADIENT}
        onPressShare={handleShareBusiness}
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

        {isGuest ? <GuestBusinessCtaBanner /> : null}

        <Animated.View style={{ opacity: contentOpacity }}>
          {activeTab === "overview" ? (
            <>
              <BusinessOverviewCard business={business} />

              <BusinessBookingCard businessId={business.id} />
              <BusinessRecommendedByPreview
                recommendations={business.about.recommendedBy}
                onPressViewAll={() =>
                  router.push({
                    pathname: "/business/recommended-by",
                    params: { businessId: business.id },
                  })
                }
                onPressRecommendation={(
                  recommendation: BusinessRecommendation,
                ) =>
                  router.push({
                    pathname: "/business/[id]",
                    params: { id: recommendation.businessId },
                  })
                }
              />
              <BusinessTopReviews
                reviews={topReviews}
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
            <BusinessServicesList services={business.services} />
          ) : null}

          {activeTab === "reviews" ? (
            <>
              <BusinessRatingSummary
                rating={reviewsSummary?.rating ?? business.rating}
                reviewCount={reviewsSummary?.reviewCount ?? reviewCount}
                breakdown={
                  reviewsSummary?.breakdown ?? business.ratingBreakdown
                }
              />

              <View
                onLayout={(event) => {
                  reviewsSectionYRef.current = event.nativeEvent.layout.y;
                }}
              >
                <BusinessReviewsList
                  reviews={reviews}
                  reviewCount={reviewCount}
                  reviewPhotos={allReviewPhotos}
                  focusedReviewId={focusedReviewId}
                  onClearFocusedReview={() => setFocusedReviewId(null)}
                  onReviewsListLayout={(y) => {
                    reviewsListYRef.current = y;
                  }}
                  onExpandReview={(reviewOffsetY) => {
                    scrollViewRef.current?.scrollTo({
                      y:
                        reviewsSectionYRef.current +
                        reviewsListYRef.current +
                        reviewOffsetY -
                        120,
                      animated: true,
                    });
                  }}
                  onPressWriteReview={(rating) =>
                    requireAuth(
                      () => {
                        router.push({
                          pathname: "/business/write-review",
                          params: {
                            businessId: business.id,
                            rating: rating ? String(rating) : undefined,
                          },
                        });
                      },
                      {
                        action: "review",
                      },
                    )
                  }
                />
              </View>
            </>
          ) : null}

          {activeTab === "photos" ? (
            <BusinessGalleryGrid
              businessPhotos={business.images}
              reviewPhotos={allReviewPhotos}
            />
          ) : null}

          {activeTab === "about" ? (
            <BusinessAboutSection
              businessId={business.id}
              about={business.about}
            />
          ) : null}
        </Animated.View>
      </Animated.ScrollView>

      <AuthRequiredModal
        visible={isAuthModalVisible}
        onClose={closeAuthModal}
        onConfirm={confirmAuthModal}
      />
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
      paddingBottom: spacing.md,
      zIndex: 10,
    },
    scrollContent: {
      paddingBottom: spacing.xl,
    },
  });
}
