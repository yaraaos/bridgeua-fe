// app/profile/business.tsx

import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import BusinessDashboardStats from "@/src/components/profile/BusinessDashboardStats/BusinessDashboardStats";
import AppAvatar from "@/src/components/ui/AppAvatar";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useActiveAccount } from "@/src/store/account.store";

type UpcomingBooking = {
  id: string;
  customerName: string;
  customerAvatar: string;
  day: "Today" | "Tomorrow";
  time: string;
  service: string;
  status: "confirmed" | "pending";
};

const upcomingBookings: UpcomingBooking[] = [
  {
    id: "booking-1",
    customerName: "Oleg Novak",
    customerAvatar: "https://i.pravatar.cc/100?img=12",
    day: "Today",
    time: "14:00",
    service: "Manicure",
    status: "confirmed",
  },
  {
    id: "booking-2",
    customerName: "Olena Chris",
    customerAvatar: "https://i.pravatar.cc/100?img=47",
    day: "Today",
    time: "17:00",
    service: "Manicure",
    status: "confirmed",
  },
  {
    id: "booking-3",
    customerName: "Kyril Novak",
    customerAvatar: "https://i.pravatar.cc/100?img=33",
    day: "Tomorrow",
    time: "11:00",
    service: "Manicure",
    status: "pending",
  },
];

const featuredReview = {
  id: "review-1",
  authorName: "Sarah M.",
  authorAvatar: "https://i.pravatar.cc/100?img=5",
  rating: 4,
  postedAgo: "2 days ago",
  text: "I've been looking for a place I can truly trust — and I finally found it. Everything was explained clearly, th...",
};

const quickActions = [
  { id: "edit-services", label: "Edit services", icon: "create-outline" },
  { id: "manage-photos", label: "Manage photos", icon: "images-outline" },
  { id: "business-info", label: "Business info", icon: "briefcase-outline" },
  { id: "team", label: "Team", icon: "people-outline" },
  { id: "add-promo", label: "Add promotions", icon: "megaphone-outline" },
] as const;

export default function BusinessProfileScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const account = useActiveAccount();

  const businessName = account.displayName;
  const handle = account.handle;
  const avatarUrl = account.avatarUrl;

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
                username={handle}
                imageUrl={avatarUrl}
                size="lg"
              />

              <View style={styles.heroTextWrap}>
                <AppText style={styles.heroName} numberOfLines={1}>
                  {businessName}
                </AppText>

                <View style={styles.heroRatingRow}>
                  {Array.from({ length: 5 }).map((_, index) => {
                    const isFilled = index < 4;
                    return (
                      <Ionicons
                        key={index}
                        name={isFilled ? "star" : "star-outline"}
                        size={12}
                        color={colors.accentOrange}
                      />
                    );
                  })}
                  <AppText style={styles.heroRatingValue}>4.5</AppText>
                  <AppText style={styles.heroRatingCount}>(28 reviews)</AppText>
                </View>

                <AppText style={styles.heroSubInfo} numberOfLines={1}>
                  Beverly Hills / California
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
                  color={colors.primaryGreen}
                />
                <AppText style={styles.editButtonText}>Edit profile</AppText>
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
                  Switch account
                </AppText>
              </Pressable>
            </View>

            <View style={styles.heroActionsRow}>
              <Pressable
                style={[styles.heroActionButton, styles.viewPublicButton]}
                onPress={() =>
                  router.push({
                    pathname: "/business/[id]",
                    params: { id: account.id },
                  })
                }
              >
                <Feather name="eye" size={14} color={colors.textPrimary} />
                <AppText style={styles.viewPublicButtonText}>
                  View public page
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
            <AppText style={styles.cardTitle}>This week</AppText>
            <AppText style={styles.cardCaption}>Apr 10 — Apr 15</AppText>
          </View>

          <BusinessDashboardStats
            bookings={24}
            newClients={6}
            profileViews={92}
          />

          <Pressable
            style={styles.cardFooterLink}
            onPress={() => router.push("/business/analytics")}
          >
            <AppText style={styles.cardFooterLinkText}>View analytics</AppText>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textPrimary}
            />
          </Pressable>
        </View>

        <Pressable
          style={styles.notificationsCard}
          onPress={() => router.push("/(tabs)/notifications")}
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
              You have 3 new notifications
            </AppText>
            <AppText style={styles.notificationsSubtitle} numberOfLines={1}>
              @kyril left a review, new booking from...
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
            <AppText style={styles.cardTitle}>Upcoming bookings</AppText>
            <Pressable onPress={() => router.push("/business/analytics")}>
              <AppText style={styles.cardLink}>View calendar</AppText>
            </Pressable>
          </View>

          <View style={styles.bookingsList}>
            {upcomingBookings.map((booking) => (
              <View key={booking.id} style={styles.bookingRow}>
                <Image
                  source={{ uri: booking.customerAvatar }}
                  style={styles.bookingAvatar}
                />

                <View style={styles.bookingInfo}>
                  <View style={styles.bookingTitleRow}>
                    <AppText style={styles.bookingDay}>{booking.day}</AppText>
                    <AppText style={styles.bookingTime}>{booking.time}</AppText>
                  </View>

                  <AppText style={styles.bookingCustomer} numberOfLines={1}>
                    {booking.customerName} • {booking.service}
                  </AppText>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    booking.status === "confirmed"
                      ? styles.statusPillConfirmed
                      : styles.statusPillPending,
                  ]}
                >
                  <AppText
                    style={[
                      styles.statusPillText,
                      booking.status === "confirmed"
                        ? styles.statusPillTextConfirmed
                        : styles.statusPillTextPending,
                    ]}
                  >
                    {booking.status === "confirmed" ? "Confirmed" : "Pending"}
                  </AppText>
                </View>
              </View>
            ))}
          </View>

          <Pressable
            style={styles.cardFooterLink}
            onPress={() => router.push("/business/analytics")}
          >
            <AppText style={styles.cardFooterLinkText}>
              View all bookings
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
            <AppText style={styles.cardTitle}>Reviews</AppText>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/business/[id]",
                  params: { id: account.id, tab: "reviews" },
                })
              }
            >
              <AppText style={styles.cardLink}>View all</AppText>
            </Pressable>
          </View>

          <View style={styles.reviewRow}>
            <Image
              source={{ uri: featuredReview.authorAvatar }}
              style={styles.reviewAvatar}
            />

            <View style={styles.reviewBody}>
              <View style={styles.reviewHeader}>
                <AppText style={styles.reviewAuthor}>
                  {featuredReview.authorName}
                </AppText>

                <View style={styles.reviewStarsRow}>
                  {Array.from({ length: 5 }).map((_, index) => {
                    const isFilled = index < featuredReview.rating;
                    return (
                      <Ionicons
                        key={index}
                        name={isFilled ? "star" : "star-outline"}
                        size={11}
                        color={colors.accentOrange}
                      />
                    );
                  })}
                  <AppText style={styles.reviewAgo}>
                    {" "}· {featuredReview.postedAgo}
                  </AppText>
                </View>
              </View>

              <AppText style={styles.reviewText} numberOfLines={3}>
                {featuredReview.text}
              </AppText>

              <View style={styles.reviewActionsRow}>
                <Pressable
                  style={[styles.reviewActionButton, styles.reviewReplyButton]}
                  onPress={() =>
                    router.push({
                      pathname: "/business/review/[reviewId]",
                      params: { reviewId: featuredReview.id },
                    })
                  }
                >
                  <AppText style={styles.reviewReplyText}>Reply</AppText>
                </Pressable>

                <Pressable
                  style={[styles.reviewActionButton, styles.reviewReportButton]}
                >
                  <AppText style={styles.reviewReportText}>Report</AppText>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText style={styles.cardTitle}>Quick actions</AppText>
          </View>

          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <Pressable
                key={action.id}
                style={styles.actionItem}
                onPress={() => {
                  if (action.id === "edit-services") {
                    router.push("/business/services");
                  } else if (action.id === "manage-photos") {
                    router.push("/business/photos");
                  } else if (action.id === "business-info") {
                    router.push("/business/edit");
                  } else if (action.id === "add-promo") {
                    router.push("/business/promotions");
                  }
                }}
              >
                <View style={styles.actionIconWrap}>
                  <Ionicons
                    name={action.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={colors.primaryGreen}
                  />
                </View>
                <AppText style={styles.actionLabel} numberOfLines={1}>
                  {action.label}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>
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
      gap: spacing.sm,
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
    statusPill: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
    },
    statusPillConfirmed: {
      backgroundColor: colors.primaryGreenSoft,
    },
    statusPillPending: {
      backgroundColor: colors.accentOrangeSoft,
    },
    statusPillText: {
      fontSize: 11,
      fontWeight: "800",
    },
    statusPillTextConfirmed: {
      color: colors.primaryGreen,
    },
    statusPillTextPending: {
      color: colors.accentOrange,
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
