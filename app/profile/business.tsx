// app/profile/business.tsx

import { Feather, Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from "react-native";

import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import BusinessDashboardStats from "@/src/components/profile/BusinessDashboardStats/BusinessDashboardStats";
import AppAvatar from "@/src/components/ui/AppAvatar";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppLabel from "@/src/components/ui/AppLabel/AppLabel";
import AppRatingStars from "@/src/components/ui/AppRatingStars";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useBusinessAnalytics } from "@/src/features/businesses/hooks/useAnalytics";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import NetworkErrorBanner from "@/src/components/ui/NetworkErrorBanner";
import { useMyBusinessProfile } from "@/src/features/businesses/hooks/useBusiness";
import { useReviews } from "@/src/features/reviews/hooks/useReviews";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { apiClient } from "@/src/services/api/client";
import { API_BASE_URL } from "@/src/services/api/config";
import { useActiveAccount } from "@/src/store/account.store";
import { useAuthStore } from "@/src/store/auth.store";
import { useTeamStore } from "@/src/store/team.store";
import { ENDPOINTS } from "@/src/services/api/endpoints";
import type { TeamMember } from "@/src/types/team";

import BusinessQuickActions from "@/src/components/profile/BusinessQuickActions/BusinessQuickActions";
import type { QuickActionId } from "@/src/components/profile/BusinessQuickActions/types";

type UpcomingBooking = {
  id: string;
  customerName: string;
  customerAvatar?: string;
  date: string;
  startTime: string;
  service: string;
  status: "confirmed" | "pending";
};

export default function BusinessProfileScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  function formatDelta(current: number, lastMonth: number): string {
    const diff = current - lastMonth;
    const sign = diff >= 0 ? "+" : "";
    return `${sign}${diff} ${t("profile.business.vsLastMonth")}`;
  }
  const account = useActiveAccount();
  const user = useAuthStore((s) => s.user);
  const { business, isLoading, error, refetch } = useMyBusinessProfile();
  const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBooking[]>([]);

  useEffect(() => {
    const businessId = business?.id;
    console.log("[Bookings] business?.id =", businessId, "| user?.activeBusinessId =", user?.activeBusinessId);
    if (!businessId) return;

    void apiClient
      .get<any[]>(ENDPOINTS.BUSINESS_BOOKINGS(String(businessId)))
      .then((res) => {
        console.log("[Bookings] API response:", JSON.stringify(res.data));
        const data = res.data ?? [];
        const upcoming = data
          .filter((b) => ["pending", "confirmed"].includes(b.status))
          .slice(0, 3)
          .map((b) => ({
            id: String(b.id),
            customerName: b.user?.profile
              ? [b.user.profile.firstName, b.user.profile.lastName].filter(Boolean).join(" ") || b.user.email
              : b.user?.email ?? t("profile.business.clientFallback"),
            customerAvatar: b.user?.profile?.avatarUrl ?? undefined,
            date: b.date,
            startTime: b.startTime?.slice(0, 5) ?? "",
            service: b.service?.name ?? t("profile.business.serviceFallback"),
            status: b.status as "confirmed" | "pending",
          }));
        setUpcomingBookings(upcoming);
      })
      .catch((err) => {
        console.log("[Bookings] API error:", err?.message);
        setUpcomingBookings([]);
      });
  }, [business?.id, t, user?.activeBusinessId]);
  const { members: teamMembers, setMembers } = useTeamStore();
  const { analytics } = useBusinessAnalytics();
  const queryClient = useQueryClient();
  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  useFocusEffect(
    useCallback(() => {
      void queryClient.invalidateQueries({ queryKey: ["business-analytics"] });
    }, [queryClient]),
  );

  useFocusEffect(
    useCallback(() => {
      if (!business?.id) return;
      void apiClient
        .get<TeamMember[]>(`/api/businesses/${business.id}/team`)
        .then((res) => {
          setMembers(
            res.data.map((m) => ({
              ...m,
              photoUrl: m.photoUrl
                ? m.photoUrl.startsWith("http")
                  ? m.photoUrl
                  : `${API_BASE_URL}${m.photoUrl}`
                : undefined,
              serviceIds: Array.isArray(m.serviceIds)
                ? m.serviceIds.map(String)
                : [],
            })),
          );
        })
        .catch(() => {});
    }, [business?.id, setMembers]),
  );

  const businessName = business?.name || "";
  const avatarUrl =
    business?.avatarUrl ?? business?.images?.[0]?.url ?? account?.avatarUrl;
  const businessLocation = business?.location ?? "";
  const businessRating = business?.rating ?? 0;
  const businessReviewCount = business?.reviewCount ?? 0;
  const publicBusinessId = business?.id ?? account?.id ?? "";

  const { reviews, isLoading: isReviewsLoading } = useReviews({
    businessId: String(publicBusinessId),
    limit: 1,
  });
  const latestReview = reviews[0] ?? null;

  if (isLoading) {
    return (
      <AppScreen style={styles.container} withTopInset={false}>
        <View style={styles.centerState}>
          <AppLoader />
        </View>
      </AppScreen>
    );
  }

  if (error) {
    return (
      <AppScreen style={styles.container} withTopInset={false}>
        {error.isNetworkError && <NetworkErrorBanner />}
        <View style={styles.centerState}>
          <AppEmptyState
            title={error.isNetworkError ? t("home.errorNoInternet") : t("home.errorSomethingWrong")}
            description={
              error.isNetworkError
                ? t("home.errorNoInternetDesc")
                : t("profile.business.errorLoadFailed")
            }
            actionLabel={t("home.errorTryAgain")}
            onPressAction={refetch}
          />
        </View>
      </AppScreen>
    );
  }

  const handleQuickActionPress = (actionId: QuickActionId) => {
    if (actionId === "add-promo") {
      router.push({
        pathname: "/(tabs)/following",
        params: {
          tab: "promotion",
          action: "create",
        },
      });
      return;
    }

    if (actionId === "add-news") {
      router.push({
        pathname: "/(tabs)/following",
        params: {
          tab: "news",
          action: "create",
        },
      });
      return;
    }

    if (actionId === "edit-services") {
      router.push({ pathname: "/business/edit", params: { tab: "services" } });
      return;
    }

    if (actionId === "edit-business") {
      router.push({ pathname: "/business/edit", params: { tab: "overview" } });
      return;
    }

    if (actionId === "edit-gallery") {
      router.push({ pathname: "/business/edit", params: { tab: "gallery" } });
      return;
    }

    if (actionId === "view-bookings") {
      router.push("/business/bookings");
      return;
    }

    if (actionId === "view-reviews") {
      router.push({
        pathname: "/business/[id]",
        params: {
          id: String(publicBusinessId),
          tab: "reviews",
        },
      });
      return;
    }

    if (actionId === "share-business") {
      void Share.share({
        message: `Check out ${business?.name} on BridgeUA\nhttps://bridgeua.app/business/${publicBusinessId}`,
      });
      return;
    }

    if (actionId === "view-public-profile") {
      router.push({
        pathname: "/business/[id]",
        params: { id: String(publicBusinessId) },
      });
      return;
    }

    if (actionId === "edit-team") {
      router.push("/profile/team");
      return;
    }

    if (actionId === "view-recommends") {
      router.push({
        pathname: "/business/recommends",
        params: { businessId: String(publicBusinessId) },
      });
      return;
    }

    if (actionId === "view-recommended-by") {
      router.push({
        pathname: "/business/recommended-by",
        params: { businessId: String(publicBusinessId) },
      });
      return;
    }
  };

  return (
    <AppScreen style={styles.container} withTopInset={false}>
      <ScreenHeader
        variant="profile"
        title=""
        rightSlot={null}
        profileContent={
          <View>
            <View style={styles.heroIdentityRow}>
              <AppAvatar
                name={businessName}
                imageUrl={avatarUrl}
                size="lg"
              />

              <View style={styles.heroTextWrap}>
                <AppText style={styles.heroName} numberOfLines={1}>
                  {businessName}
                </AppText>

                <View style={styles.heroRatingRow}>
                  {Array.from({ length: 5 }).map((_, index) => {
                    const isFilled = index < Math.round(businessRating);
                    return (
                      <Ionicons
                        key={index}
                        name={isFilled ? "star" : "star-outline"}
                        size={12}
                        color={colors.accentOrange}
                      />
                    );
                  })}
                  <AppText style={styles.heroRatingValue}>
                    {businessRating.toFixed(1)}
                  </AppText>
                  <AppText style={styles.heroRatingCount}>
                    ({t("profile.business.reviewsCount", { count: businessReviewCount })})
                  </AppText>
                </View>

                <AppText style={styles.heroSubInfo} numberOfLines={1}>
                  {businessLocation || t("profile.business.locationNotAdded")}
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

            <View style={styles.primaryActionsRow}>
              <Pressable
                style={[styles.primaryActionButton, styles.editButton]}
                onPress={() => router.push("/business/edit")}
              >
                <Ionicons
                  name="create-outline"
                  size={16}
                  color={colors.textMuted}
                />
                <AppText style={styles.editButtonText}>{t("profile.business.editProfile")}</AppText>
              </Pressable>

              <Pressable
                style={[styles.primaryActionButton, styles.switchButton]}
                onPress={() => router.push("/modal/switch-account")}
              >
                <Ionicons
                  name="swap-horizontal-outline"
                  size={16}
                  color={colors.textMuted}
                />
                <AppText style={styles.switchButtonText}>
                  {t("profile.business.switchAccount")}
                </AppText>
              </Pressable>
            </View>

            <View style={styles.heroActionsRow}>
              <Pressable
                style={[styles.heroActionButton, styles.viewPublicButton]}
                onPress={() =>
                  router.push({
                    pathname: "/business/[id]",
                    params: { id: publicBusinessId },
                  })
                }
              >
                <Feather name="eye" size={14} color={colors.textPrimary} />
                <AppText style={styles.viewPublicButtonText}>
                  {t("profile.business.viewPublicPage")}
                </AppText>
              </Pressable>
            </View>
          </View>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText style={styles.cardTitle}>{t("profile.business.analytics")}</AppText>
          </View>

          <BusinessDashboardStats
            bookings={analytics?.bookings.current ?? 0}
            bookingsDelta={
              analytics
                ? formatDelta(analytics.bookings.current, analytics.bookings.lastMonth)
                : undefined
            }
            newClients={analytics?.newClients.current ?? 0}
            newClientsDelta={
              analytics
                ? formatDelta(analytics.newClients.current, analytics.newClients.lastMonth)
                : undefined
            }
            followers={analytics?.followers.current ?? 0}
            followersDelta={
              analytics
                ? formatDelta(analytics.followers.current, analytics.followers.lastMonth)
                : undefined
            }
          />
        </View>

        <Pressable
          style={styles.notificationsCard}
          onPress={() => router.push({
            pathname: "/(tabs)/notifications",
            params: { tab: "unread" },
          })}
        >
          <View style={styles.notificationsIcon}>
            <Ionicons
              name="notifications-outline"
              size={18}
              color={colors.primaryGreen}
            />
          </View>

          <View style={styles.notificationsText}>
            <AppText style={styles.notificationsTitle}>
              {t("profile.business.notificationsTitle")}
            </AppText>
            <AppText style={styles.notificationsSubtitle} numberOfLines={1}>
              {t("profile.business.notificationsSubtitle")}
            </AppText>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textSecondary}
          />
        </Pressable>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText style={styles.cardTitle}>{t("profile.business.upcomingBookings")}</AppText>
            <Pressable onPress={() => router.push("/business/bookings")}>
              <AppText style={styles.cardLink}>{t("profile.business.viewAll")}</AppText>
            </Pressable>
          </View>

          <View style={styles.bookingsList}>
            {upcomingBookings.length === 0 ? (
              <AppText style={{ color: colors.textMuted, fontSize: 14 }}>
                {t("profile.business.noUpcomingBookings")}
              </AppText>
            ) : null}
            {upcomingBookings.map((booking) => (
              <View key={booking.id} style={styles.bookingRow}>
                <AppAvatar
                  size="sm"
                  name={booking.customerName}
                  imageUrl={booking.customerAvatar}
                />

                <View style={styles.bookingInfo}>
                  <View style={styles.bookingTitleRow}>
                    <AppText style={styles.bookingDay}>{booking.date}</AppText>
                    <AppText style={styles.bookingTime}>{booking.startTime}</AppText>
                  </View>

                  <AppText style={styles.bookingCustomer} numberOfLines={1}>
                    {booking.customerName} • {booking.service}
                  </AppText>
                </View>

                <AppLabel
                  label={t("profile.business.statusConfirmed")}
                  variant="confirmed"
                />
              </View>
            ))}
          </View>

          <Pressable
            style={styles.cardFooterLink}
            onPress={() => router.push("/business/bookings")}
          >
            <AppText style={styles.cardFooterLinkText}>
              {t("profile.business.viewAllBookings")}
            </AppText>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textPrimary}
            />
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText style={styles.cardTitle}>{t("profile.business.myTeam")}</AppText>
            <Pressable onPress={() => router.push("/profile/team")}>
              <AppText style={styles.cardLink}>{t("profile.business.viewAll")}</AppText>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {teamMembers.length === 0 ? (
              <AppText
                style={{
                  color: colors.textMuted,
                  fontSize: 13,
                  fontStyle: "italic",
                }}
              >
                {t("profile.business.noTeamMembers")}
              </AppText>
            ) : (
              teamMembers.map((member) => (
                <Pressable
                  key={member.id}
                  style={{ alignItems: "center", gap: 4 }}
                  onPress={() =>
                    router.push({
                      pathname: "/profile/team-member",
                      params: { memberId: member.id },
                    })
                  }
                >
                  <AppAvatar
                    name={`${member.firstName} ${member.lastName}`}
                    imageUrl={member.photoUrl}
                    size="md"
                  />
                  <AppText
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: colors.textPrimary,
                      textAlign: "center",
                    }}
                    numberOfLines={2}
                  >
                    {member.firstName} {member.lastName}
                  </AppText>
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText style={styles.cardTitle}>{t("profile.business.reviews")}</AppText>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/business/[id]",
                  params: { id: String(publicBusinessId), tab: "reviews" },
                })
              }
            >
              <AppText style={styles.cardLink}>{t("profile.business.viewAll")}</AppText>
            </Pressable>
          </View>

          {latestReview ? (
            <View style={styles.reviewRow}>
              <Image
                source={
                  latestReview.authorAvatar
                    ? { uri: latestReview.authorAvatar }
                    : undefined
                }
                style={styles.reviewAvatar}
              />

              <View style={styles.reviewBody}>
                <View style={styles.reviewHeader}>
                  <AppText style={styles.reviewAuthor}>
                    {latestReview.authorName}
                  </AppText>

                  <View style={styles.reviewStarsRow}>
                    <AppRatingStars rating={latestReview.rating} size={11} />
                    <AppText style={styles.reviewAgo}>
                      {" "}
                      · {new Date(latestReview.createdAt).toLocaleDateString()}
                    </AppText>
                  </View>
                </View>

                <AppText style={styles.reviewText} numberOfLines={3}>
                  {latestReview.text}
                </AppText>

                <View style={styles.reviewActionsRow}>
                  <Pressable
                    style={[
                      styles.reviewActionButton,
                      styles.reviewReplyButton,
                    ]}
                    onPress={() =>
                      router.push({
                        pathname: "/business/review/[reviewId]",
                        params: {
                          reviewId: String(latestReview?.id ?? ""),
                          reviewData: JSON.stringify(latestReview),
                        },
                      })
                    }
                  >
                    <AppText style={styles.reviewReplyText}>{t("profile.business.reply")}</AppText>
                  </Pressable>

                  {false && <Pressable
                    style={[
                      styles.reviewActionButton,
                      styles.reviewReportButton,
                    ]}
                  >
                    <AppText style={styles.reviewReportText}>Report</AppText>
                  </Pressable>}
                </View>
              </View>
            </View>
          ) : isReviewsLoading ? null : (
            <AppText
              style={{
                color: colors.textMuted,
                fontSize: 13,
                fontStyle: "italic",
              }}
            >
              {t("profile.business.noReviews")}
            </AppText>
          )}
        </View>
        <BusinessQuickActions
          businessId={String(publicBusinessId)}
          onActionPress={handleQuickActionPress}
        />
      </ScrollView>
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      padding: 0,
      backgroundColor: colors.background,
    },
    centerState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
    },
    errorText: {
      textAlign: "center",
      color: colors.error,
      fontSize: 14,
      fontWeight: "600",
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxl,
      gap: spacing.md,
    },

    settingsButton: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 4,
      justifyContent: "center",
      backgroundColor: colors.accentOrange,
      alignSelf: "flex-start",
    },

    heroIdentityRow: {
      marginTop: 5,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.lg,
    },
    heroTextWrap: {
      flex: 1,
      minWidth: 0,
    },
    heroName: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    heroRatingRow: {
      marginTop: 4,
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },
    heroRatingValue: {
      marginLeft: 4,
      fontSize: 12,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    heroRatingCount: {
      marginLeft: 4,
      fontSize: 12,
      color: colors.textSecondary,
    },
    heroSubInfo: {
      marginTop: 2,
      fontSize: 12,
      color: colors.textSecondary,
    },
    primaryActionsRow: {
      marginTop: spacing.sm,
      flexDirection: "row",
      gap: spacing.sm,
    },
    primaryActionButton: {
      flex: 1,
      minHeight: 30,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    editButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    switchButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    editButtonText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textMuted,
    },
    switchButtonText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textMuted,
    },

    heroActionsRow: {
      marginTop: spacing.sm,
      flexDirection: "row",
      gap: spacing.sm,
    },
    heroActionButton: {
      flex: 1,
      minHeight: 30,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    viewPublicButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    viewPublicButtonText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textPrimary,
    },

    card: {
      padding: spacing.lg,
      borderRadius: 24,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.md,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    cardCaption: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    cardLink: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.primaryGreen,
    },
    cardFooterLink: {
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    cardFooterLinkText: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textPrimary,
    },

    notificationsCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: 18,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    notificationsIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primaryGreenSoft,
    },
    notificationsText: {
      flex: 1,
      minWidth: 0,
    },
    notificationsTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    notificationsSubtitle: {
      marginTop: 2,
      fontSize: 12,
      color: colors.textSecondary,
    },

    bookingsList: {
      gap: 6,
    },
    bookingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    bookingAvatar: {
      width: 40,
      height: 40,
      borderRadius: 999,
      backgroundColor: colors.primaryGreenSoft,
    },
    bookingInfo: {
      flex: 1,
      minWidth: 0,
    },
    bookingTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    bookingDay: {
      fontSize: 14,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    bookingTime: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    bookingCustomer: {
      marginTop: 2,
      fontSize: 12,
      color: colors.textSecondary,
    },
    reviewRow: {
      flexDirection: "row",
      gap: spacing.md,
    },
    reviewAvatar: {
      width: 40,
      height: 40,
      borderRadius: 999,
      backgroundColor: colors.primaryGreenSoft,
    },
    reviewBody: {
      flex: 1,
      minWidth: 0,
      gap: 4,
    },
    reviewHeader: {
      gap: 2,
    },
    reviewAuthor: {
      fontSize: 13,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    reviewStarsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 1,
    },
    reviewAgo: {
      marginLeft: 4,
      fontSize: 11,
      color: colors.textSecondary,
    },
    reviewText: {
      marginTop: 4,
      fontSize: 13,
      color: colors.textSecondary,
    },
    reviewActionsRow: {
      marginTop: spacing.sm,
      flexDirection: "row",
      gap: spacing.sm,
    },
    reviewActionButton: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 999,
    },
    reviewReplyButton: {
      backgroundColor: colors.primaryGreenSoft,
    },
    reviewReplyText: {
      fontSize: 12,
      fontWeight: "800",
      color: colors.primaryGreen,
    },
    reviewReportButton: {
      borderWidth: 1,
      borderColor: colors.border,
    },
    reviewReportText: {
      fontSize: 12,
      fontWeight: "800",
      color: colors.textSecondary,
    },

    actionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    actionItem: {
      width: "18%",
      alignItems: "center",
      gap: 6,
    },
    actionIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primaryGreenSoft,
    },
    actionLabel: {
      fontSize: 10,
      fontWeight: "700",
      color: colors.textPrimary,
      textAlign: "center",
    },
  });
}
