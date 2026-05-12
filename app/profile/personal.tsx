import AppAvatar from "@/src/components/ui/AppAvatar/AppAvatar";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { personalProfileMock } from "@/src/mocks/profile.mock";
import type {
  PersonalProfileMenuItem,
  PersonalProfileReview,
  PersonalProfileStat,
} from "@/src/types/profile";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

export default function PersonalProfileScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const profile = personalProfileMock;

  return (
    <AppScreen style={styles.container} withTopInset={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.hero}>
          <View style={styles.topActionsRow}>
            <Pressable
              style={styles.iconButton}
              onPress={() => router.push("/settings")}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={colors.textPrimary}
              />
            </Pressable>
          </View>

          <View style={styles.profileIdentity}>
            <AppAvatar
              imageUrl={profile.avatarUrl}
              name={profile.displayName}
              size="lg"
            />

            <View style={styles.identityTextWrap}>
              <AppText style={styles.username}>@{profile.username}</AppText>
              <AppText style={styles.displayName}>
                {profile.displayName}
              </AppText>
            </View>
          </View>

          <View style={styles.statsCard}>
            {profile.stats.map((stat) => (
              <ProfileStatItem key={stat.id} stat={stat} />
            ))}
          </View>

          <View style={styles.actionsRow}>
            <View style={styles.actionItem}>
              <AppButton
                title="Edit profile"
                variant="primary"
                onPress={() => router.push("/profile/edit")}
              />
            </View>

            <View style={styles.actionItem}>
              <AppButton
                title="Switch account"
                variant="secondary"
                onPress={() => router.push("/profile/switch-account")}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Your reviews</AppText>

          <View style={styles.reviewsList}>
            {profile.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </View>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

function ProfileStatItem({ stat }: { stat: PersonalProfileStat }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.statItem}>
      <AppText style={styles.statValue}>{stat.value}</AppText>
      <AppText style={styles.statLabel}>{stat.label}</AppText>
    </View>
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
          params: { id: review.businessId },
        })
      }
    >
      <View style={styles.reviewTopRow}>
        <View style={styles.reviewBusinessWrap}>
          <AppText style={styles.reviewBusinessName}>
            {review.businessName}
          </AppText>

          <AppText style={styles.reviewMeta}>
            {review.businessCategory} • {review.businessLocation}
          </AppText>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.textSecondary}
        />
      </View>

      <View style={styles.ratingRow}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Ionicons
            key={index}
            name={index < review.rating ? "star" : "star-outline"}
            size={15}
            color={colors.accentOrange}
          />
        ))}
      </View>

      <AppText style={styles.reviewText}>{review.text}</AppText>
    </Pressable>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      padding: 0,
      backgroundColor: colors.background,
    },
    content: {
      paddingBottom: 120,
    },
    hero: {
      paddingTop: 62,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
      backgroundColor: colors.surface,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    topActionsRow: {
      alignItems: "flex-end",
      marginBottom: spacing.md,
    },
    iconButton: {
      width: 42,
      height: 42,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    profileIdentity: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    identityTextWrap: {
      flex: 1,
    },
    username: {
      fontSize: 30,
      fontWeight: "900",
      color: colors.textPrimary,
    },
    displayName: {
      marginTop: 4,
      fontSize: 17,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    statsCard: {
      marginTop: spacing.xl,
      paddingVertical: spacing.lg,
      borderRadius: 24,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      justifyContent: "space-around",
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statValue: {
      fontSize: 20,
      fontWeight: "900",
      color: colors.textPrimary,
    },
    statLabel: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    actionsRow: {
      marginTop: spacing.lg,
      flexDirection: "row",
      gap: spacing.sm,
    },
    actionItem: {
      flex: 1,
    },
    section: {
      marginTop: spacing.xl,
      paddingHorizontal: spacing.lg,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "900",
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    reviewsList: {
      gap: spacing.md,
    },
    reviewCard: {
      padding: spacing.lg,
      borderRadius: 24,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    reviewTopRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    reviewBusinessWrap: {
      flex: 1,
    },
    reviewBusinessName: {
      fontSize: 17,
      fontWeight: "900",
      color: colors.textPrimary,
    },
    reviewMeta: {
      marginTop: 4,
      fontSize: 13,
      color: colors.textSecondary,
    },
    ratingRow: {
      marginTop: spacing.md,
      flexDirection: "row",
      gap: 2,
    },
    reviewText: {
      marginTop: spacing.sm,
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSecondary,
    },
    menuCard: {
      overflow: "hidden",
      borderRadius: 24,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      padding: spacing.lg,
    },
    menuItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuIcon: {
      width: 42,
      height: 42,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primaryGreenSoft,
    },
    menuTextWrap: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 16,
      fontWeight: "900",
      color: colors.textPrimary,
    },
    menuSubtitle: {
      marginTop: 4,
      fontSize: 13,
      lineHeight: 18,
      color: colors.textSecondary,
    },
  });
}
