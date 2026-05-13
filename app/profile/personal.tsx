import FollowButton from "@/src/components/business/FollowButton/FollowButton";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { getMyReviews } from "@/src/features/reviews/services/review.service";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { businessesMock } from "@/src/mocks/businesses.mock";
import { personalProfileMock } from "@/src/mocks/profile.mock";
import { useFollowingStore } from "@/src/store/following.store";
import type {
  PersonalProfileFollowedBusiness,
  PersonalProfileReview,
} from "@/src/types/profile";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";

import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";

export default function PersonalProfileScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const profile = personalProfileMock;

  const followedBusinessIds = useFollowingStore(
    (state) => state.followedBusinessIds,
  );

  const [myReviews, setMyReviews] = useState<PersonalProfileReview[]>([]);

  useFocusEffect(
    useCallback(() => {
      getMyReviews().then(setMyReviews);
    }, []),
  );

  const followedBusinesses = useMemo(
    () =>
      businessesMock
        .filter((business) => followedBusinessIds.includes(String(business.id)))
        .map((business) => ({
          id: String(business.id),
          name: business.name,
          imageUrl: business.image,
          rating: business.rating,
          category: business.category,
          location: business.location,
        })),
    [followedBusinessIds],
  );

  const profileStats = useMemo(
    () => [
      {
        id: "following" as const,
        label: "Following",
        value: followedBusinesses.length,
      },
      {
        id: "reviews" as const,
        label: "Reviews",
        value: myReviews.length,
      },
    ],
    [followedBusinesses.length, myReviews.length],
  );

  return (
    <AppScreen style={styles.container} withTopInset={false}>
      <ScreenHeader
        variant="profile"
        title=""
        rightSlot={null}
        profileContent={
          <View>
            <View style={styles.heroIdentityRow}>
              <View style={styles.heroAvatarWrap}>
                <Image
                  source={{ uri: profile.avatarUrl }}
                  style={styles.heroAvatar}
                />
              </View>

              <View style={styles.heroTextWrap}>
                <AppText style={styles.heroName} numberOfLines={1}>
                  {profile.displayName}
                </AppText>

                <AppText style={styles.heroUsername} numberOfLines={1}>
                  @{profile.username}
                </AppText>
              </View>

              <Pressable
                style={styles.settingsButton}
                onPress={() => router.push("/settings")}
              >
                <Ionicons
                  name="settings-outline"
                  size={20}
                  color={colors.white}
                />
              </Pressable>
            </View>

            <View style={styles.heroActionsRow}>
              <Pressable
                style={[styles.heroActionButton, styles.editButton]}
                onPress={() => router.push("/profile/edit")}
              >
                <Ionicons
                  name="create-outline"
                  size={16}
                  color={colors.primaryGreen}
                />
                <AppText style={styles.editButtonText}>Edit profile</AppText>
              </Pressable>

              <Pressable
                style={[styles.heroActionButton, styles.switchButton]}
                onPress={() => router.push("/profile/switch-account")}
              >
                <Ionicons
                  name="swap-horizontal-outline"
                  size={16}
                  color={colors.textMuted}
                />
                <AppText style={styles.switchButtonText}>
                  Switch account
                </AppText>
              </Pressable>
            </View>
          </View>
        }
      />
      <View style={styles.statsRow}>
        {profileStats.map((stat, index) => (
          <React.Fragment key={stat.id}>
            <Pressable
              style={styles.statItem}
              onPress={() => {
                if (stat.id === "following") {
                  router.push("/profile/following");
                  return;
                }

                router.push("/profile/reviews");
              }}
            >
              <AppText style={styles.statValue}>{stat.value}</AppText>
              <AppText style={styles.statLabel}>{stat.label}</AppText>
            </Pressable>

            {index !== profileStats.length - 1 ? (
              <View style={styles.statDivider} />
            ) : null}
          </React.Fragment>
        ))}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.sectionHeaderRow}>
          <AppText style={styles.sectionTitle}>You follow</AppText>

          <Pressable onPress={() => router.push("/profile/following")}>
            <AppText style={styles.seeAllText}>See all</AppText>
          </Pressable>
        </View>

        {followedBusinesses.length === 0 ? (
          <View style={styles.emptyStateWrap}>
            <AppEmptyState
              title="No followed businesses yet"
              description="Businesses you follow will appear here."
            />
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.followedList}
          >
            {followedBusinesses.map((business) => (
              <FollowedBusinessCard key={business.id} business={business} />
            ))}
          </ScrollView>
        )}

        <View style={styles.reviewsSection}>
          <View style={styles.sectionHeaderRow}>
            <AppText style={styles.sectionTitle}>Your reviews</AppText>

            <Pressable onPress={() => router.push("/profile/reviews")}>
              <AppText style={styles.seeAllText}>See all</AppText>
            </Pressable>
          </View>

          {myReviews.length === 0 ? (
            <View style={styles.emptyStateWrap}>
              <AppEmptyState
                title="No reviews yet"
                description="Your reviews will appear here after you share your experience."
              />
            </View>
          ) : (
            <View style={styles.reviewsList}>
              {myReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </AppScreen>
  );
}

function FollowedBusinessCard({
  business,
}: {
  business: PersonalProfileFollowedBusiness;
}) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      style={styles.followedCard}
      onPress={() =>
        router.push({
          pathname: "/business/[id]",
          params: { id: business.id },
        })
      }
    >
      <View>
        <Image
          source={{ uri: business.imageUrl }}
          style={styles.followedImage}
        />
        <FollowButton
          businessId={business.id}
          size="icon"
          style={styles.followHeart}
        />
      </View>

      <View style={styles.followedInfo}>
        <AppText style={styles.followedName} numberOfLines={1}>
          {business.name}
        </AppText>

        <View style={styles.followedRatingRow}>
          <Ionicons name="star" size={14} color={colors.accentOrange} />
          <AppText style={styles.followedRating}>
            {business.rating.toFixed(1)}
          </AppText>
        </View>

        <AppText style={styles.followedLocation} numberOfLines={1}>
          {business.location}
        </AppText>
      </View>
    </Pressable>
  );
}

function ReviewCard({ review }: { review: PersonalProfileReview }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      style={styles.reviewCard}
      onPress={() =>
        router.push({
          pathname: "/business/[id]",
          params: {
            id: review.businessId,
            tab: "reviews",
            focusedReviewId: review.id,
          },
        })
      }
    >
      <Image
        source={{ uri: review.businessImageUrl }}
        style={styles.reviewImage}
      />

      <View style={styles.reviewContent}>
        <AppText style={styles.reviewBusinessName} numberOfLines={1}>
          {review.businessName}
        </AppText>

        <View style={styles.reviewRatingRow}>
          <Ionicons name="star" size={14} color={colors.accentOrange} />
          <AppText style={styles.reviewRating}>
            {review.rating.toFixed(1)}
          </AppText>
        </View>

        <AppText style={styles.reviewText} numberOfLines={1}>
          {review.text}
        </AppText>
      </View>

      <View style={styles.reviewRight}>
        <View style={styles.reviewDateWrap}>
          <AppText style={styles.reviewDate}>
            {formatReviewDate(review.createdAt)}
          </AppText>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.textSecondary}
        />
      </View>
    </Pressable>
  );
}

function formatReviewDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      padding: 0,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: 14,
    },
    settingsButton: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accentOrange,
      alignSelf: "flex-start",
    },
    heroIdentityRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.lg,
      marginTop: 10,
    },

    heroTextWrap: {
      flex: 1,
      minWidth: 0,
      justifyContent: "center",
    },

    heroName: {
      fontSize: 22,
      lineHeight: 27,
      fontWeight: "800",
      color: colors.textPrimary,
    },

    heroUsername: {
      marginTop: 6,
      fontSize: 16,
      lineHeight: 20,
      fontWeight: "700",
      color: colors.textSecondary,
    },

    heroActionsRow: {
      marginTop: spacing.sm,
      flexDirection: "row",
      gap: spacing.sm,
    },

    heroActionButton: {
      flex: 1,
      minHeight: 36,
      borderRadius: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },

    editButton: {
      backgroundColor: colors.primaryGreenSoft,
      borderWidth: 1,
      borderColor: colors.primaryGreenSoft,
    },

    switchButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },

    editButtonText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.primaryGreen,
    },

    switchButtonText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textMuted,
    },
    statsRow: {
      marginTop: spacing.md,
      paddingVertical: 10,
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: spacing.lg,
    },
    statItem: {
      flex: 1,
      alignItems: "center",
    },
    statValue: {
      fontSize: 19,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    statLabel: {
      marginTop: 2,
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    statDivider: {
      width: 1,
      height: 34,
      backgroundColor: colors.border,
    },
    sectionHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: 18,
      lineHeight: 22,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    seeAllText: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.primaryGreen,
    },
    followedList: {
      gap: spacing.sm,
      paddingRight: spacing.lg,
    },
    followedCard: {
      width: 136,
      overflow: "hidden",
      borderRadius: 22,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    followedImage: {
      width: "100%",
      height: 118,
      backgroundColor: colors.primaryGreenSoft,
    },
    followHeart: {
      position: "absolute",
      top: 10,
      right: 10,
      width: 36,
      height: 36,
      borderRadius: 10,
    },
    followedInfo: {
      padding: spacing.md,
    },
    followedName: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    followedRatingRow: {
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    followedRating: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    followedLocation: {
      marginTop: 8,
      fontSize: 13,
      color: colors.textSecondary,
    },
    reviewsSection: {
      marginTop: spacing.xxl,
    },
    reviewsList: {
      gap: spacing.sm,
    },
    reviewCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: 24,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    reviewImage: {
      width: 72,
      height: 72,
      borderRadius: 18,
      backgroundColor: colors.primaryGreenSoft,
    },
    reviewContent: {
      flex: 1,
      minWidth: 0,
    },
    reviewBusinessName: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    reviewRatingRow: {
      marginTop: 6,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    reviewRating: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    reviewText: {
      marginTop: 8,
      fontSize: 14,
      color: colors.textSecondary,
    },
    reviewRight: {
      alignSelf: "flex-start",
      alignItems: "flex-end",
      gap: spacing.md,
    },
    reviewDateWrap: {
      transform: [{ translateY: -3 }],
    },
    reviewDate: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    heroAvatarWrap: {
      width: 96,
      height: 96,
      borderRadius: 48,
      overflow: "hidden",
      backgroundColor: colors.primaryGreenSoft,
    },

    heroAvatar: {
      width: "100%",
      height: "100%",
    },
    profileSummaryCard: {
      paddingHorizontal: spacing.lg,
      marginTop: -12,
      marginBottom: spacing.lg,
    },
    emptyStateWrap: {
      paddingVertical: spacing.lg,
    },
  });
}
