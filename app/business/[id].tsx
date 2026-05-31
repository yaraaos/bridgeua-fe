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
import RecommendButton from "@/src/components/business/RecommendButton";
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
import { buildBusinessPreview } from "@/src/features/businesses/utils/buildBusinessPreview";
import { useReviews } from "@/src/features/reviews/hooks/useReviews";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useAuthStore } from "@/src/store/auth.store";
import { useEditBusinessStore } from "@/src/store/editBusiness.store";
import { useProfileStore } from "@/src/store/profile.store";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  const accountType = useAuthStore((state) => state.user?.accountType);
  const isBusinessOwner = accountType === "business";
  const currentUserId = useProfileStore((state) => state.profile.id);

  const {
    id,
    tab,
    focusedReviewId: focusedReviewIdParam,
    preview,
  } = useLocalSearchParams<{
    id?: string;
    tab?: string;
    focusedReviewId?: string;
    preview?: string;
  }>();

  const [activeTab, setActiveTab] = useState<BusinessDetailsTab>("overview");
  const [focusedReviewId, setFocusedReviewId] = useState<string | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const reviewsSectionYRef = useRef(0);
  const reviewsListYRef = useRef(0);

  const { business, isLoading, refetch } = useBusinessDetails(id);
  const dirty = useEditBusinessStore((state) => state.dirty);
  const overviewDraft = useEditBusinessStore((state) => state.overviewDraft);
  const galleryDraft = useEditBusinessStore((state) => state.galleryDraft);
  const servicesDraft = useEditBusinessStore((state) => state.servicesDraft);
  const aboutDraft = useEditBusinessStore((state) => state.aboutDraft);
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

  const shouldShowHeroGallery = activeTab === "overview";
  const stickyIndex = shouldShowHeroGallery ? 1 : 0;

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

  const isEditPreview = preview === "edit";
  const viewBusiness = isEditPreview
    ? buildBusinessPreview({
        business,
        dirty,
        overviewDraft,
        galleryDraft,
        servicesDraft,
        aboutDraft,
      })
    : business;

  const heroPhotos =
    viewBusiness.images.length > 0
      ? viewBusiness.images
      : viewBusiness.reviewPhotos;

  const allReviewPhotos = reviews.flatMap((review) => review.photos ?? []);

  const handleShareBusiness = async () => {
    try {
      await Share.share({
        message: `Check out ${viewBusiness.name} on BridgeUA\nhttps://bridgeua.app/business/${viewBusiness.id}`,
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

  const services = viewBusiness.services ?? [];

  return (
    <AppScreen withTopInset={false} style={styles.container}>
      <ScreenHeader
        variant="business"
        title={viewBusiness.name}
        imageUrl={viewBusiness.avatarUrl ?? viewBusiness.images[0]?.url}
        rating={reviewsSummary?.rating ?? viewBusiness.rating}
        reviewCount={reviewsSummary?.reviewCount ?? reviewCount}
        category={viewBusiness.category}
        location={viewBusiness.location}
        isOpen={viewBusiness.isOpen}
        closesAt={viewBusiness.closesAt}
        gradientColors={DISCOVERY_GRADIENT}
        onPressShare={isEditPreview ? undefined : handleShareBusiness}
        rightSlot={
          isEditPreview ? null : viewBusiness.ownerId &&
            String(viewBusiness.ownerId) ===
              String(currentUserId) ? null : isBusinessOwner ? (
            <RecommendButton
              businessId={viewBusiness.id}
              businessName={viewBusiness.name}
              onRecommendChange={() => void refetch()}
            />
          ) : (
            <FollowButton
              businessId={viewBusiness.id}
              size="icon"
              variant="soft"
            />
          )
        }
      />

      {isEditPreview ? (
        <View style={styles.previewBanner}>
          <Text style={styles.previewBannerTitle}>Preview mode</Text>
          <Text style={styles.previewBannerSubtitle}>
            Unsaved changes are visible only to you
          </Text>
        </View>
      ) : null}

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
        {shouldShowHeroGallery ? (
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
                  businessId: viewBusiness.id,
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
              <BusinessOverviewCard business={viewBusiness} />

              {(viewBusiness.services?.length ?? 0) > 0 && (
                <BusinessBookingCard
                  businessId={viewBusiness.id}
                  category={viewBusiness.category}
                  disabled={isEditPreview}
                />
              )}

              <BusinessRecommendedByPreview
                recommendations={viewBusiness.about.recommendedBy}
                onPressViewAll={() =>
                  router.push({
                    pathname: "/business/recommended-by",
                    params: { businessId: viewBusiness.id },
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
                reviewCount={viewBusiness.reviewCount}
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
              services={services}
              disabled={isEditPreview}
              onPressService={isEditPreview ? undefined : (service) => {
                router.push({
                  pathname: "/bookings/choose-service",
                  params: {
                    businessId: viewBusiness.id,
                    serviceId: service.id,
                  },
                });
              }}
            />
          ) : null}

          {activeTab === "reviews" ? (
            <>
              <BusinessRatingSummary
                rating={reviewsSummary?.rating ?? viewBusiness.rating}
                reviewCount={reviewsSummary?.reviewCount ?? reviewCount}
                breakdown={
                  reviewsSummary?.breakdown ?? viewBusiness.ratingBreakdown
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
                  isPreview={isEditPreview}
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
                  onPressWriteReview={
                    isEditPreview
                      ? undefined
                      : (rating) => {
                          if (isBusinessOwner) {
                            Alert.alert(
                              "Not available",
                              "Business profiles cannot leave reviews.",
                              [{ text: "OK" }],
                            );
                            return;
                          }
                          requireAuth(
                            () => {
                              router.push({
                                pathname: "/business/write-review",
                                params: {
                                  businessId: viewBusiness.id,
                                  rating: rating ? String(rating) : undefined,
                                },
                              });
                            },
                            {
                              action: "review",
                            },
                          );
                        }
                  }
                />
              </View>
            </>
          ) : null}

          {activeTab === "photos" ? (
            <BusinessGalleryGrid
              businessPhotos={viewBusiness.images}
              reviewPhotos={allReviewPhotos}
            />
          ) : null}

          {activeTab === "about" ? (
            <BusinessAboutSection
              businessId={viewBusiness.id}
              about={viewBusiness.about}
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
    previewBanner: {
      marginHorizontal: spacing.md,
      marginTop: spacing.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.accentOrange + "22",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.accentOrange + "55",
      alignItems: "center",
      gap: 2,
    },
    previewBannerTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.accentOrange,
    },
    previewBannerSubtitle: {
      fontSize: 11,
      color: colors.accentOrange,
      textAlign: "center",
    },
  });
}
