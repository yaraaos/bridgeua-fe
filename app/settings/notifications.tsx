import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { useSettings } from "@/src/features/settings/hooks/useSettings";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useAuthStore } from "@/src/store/auth.store";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import type { UserSettings } from "@/src/features/settings/types/settings.types";

type BooleanSettingKey = Exclude<keyof UserSettings, "language">;

// ─── SettingsSection ─────────────────────────────────────────────────────────

function SettingsSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

// ─── SettingsRow ─────────────────────────────────────────────────────────────

function SettingsRow({
  title,
  subtitle,
  rightElement,
}: {
  title: string;
  subtitle: string;
  rightElement?: React.ReactNode;
}) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.row}>
      <View style={styles.rowContent}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      {rightElement}
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function NotificationsScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const { t } = useTranslation();
  const accountType = useAuthStore((state) => state.user?.accountType);
  const { settings, isLoading, updateSetting } = useSettings();

  function renderSwitch(key: BooleanSettingKey) {
    return (
      <Switch
        value={(settings?.[key] as boolean) ?? true}
        onValueChange={(val) => updateSetting(key, val)}
        trackColor={{ false: colors.textMuted, true: colors.primaryGreen }}
        thumbColor={colors.white}
        ios_backgroundColor={colors.textMuted}
      />
    );
  }

  return (
    <View style={styles.safeArea}>
      <ScreenHeader title={t("notifications.title")} onBack={() => router.back()} />

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primaryGreen} />
        </View>
      ) : accountType === "business" ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SettingsSection label={t("notifications.sections.bookings")}>
            <SettingsRow
              title={t("notifications.rows.newBookingRequest.title")}
              subtitle={t("notifications.rows.newBookingRequest.subtitle")}
              rightElement={renderSwitch("notifyNewBookingRequest")}
            />
            <View style={styles.divider} />
            <SettingsRow
              title={t("notifications.rows.bookingConfirmed.title")}
              subtitle={t("notifications.rows.bookingConfirmed.subtitle")}
              rightElement={renderSwitch("notifyBookingConfirmed")}
            />
            <View style={styles.divider} />
            <SettingsRow
              title={t("notifications.rows.bookingCancelled.title")}
              subtitle={t("notifications.rows.bookingCancelled.subtitle")}
              rightElement={renderSwitch("notifyBookingCancelled")}
            />
          </SettingsSection>

          <SettingsSection label={t("notifications.sections.reviewsEngagement")}>
            <SettingsRow
              title={t("notifications.rows.newReview.title")}
              subtitle={t("notifications.rows.newReview.subtitle")}
              rightElement={renderSwitch("notifyNewReview")}
            />
            <View style={styles.divider} />
            <SettingsRow
              title={t("notifications.rows.systemUpdates.title")}
              subtitle={t("notifications.rows.systemUpdates.subtitle")}
              rightElement={renderSwitch("notifySystemUpdates")}
            />
          </SettingsSection>

          <SettingsSection label={t("notifications.sections.teamOperations")}>
            <SettingsRow
              title={t("notifications.rows.teamActivity.title")}
              subtitle={t("notifications.rows.teamActivity.subtitle")}
              rightElement={renderSwitch("notifyTeamActivity")}
            />
            <View style={styles.divider} />
            <SettingsRow
              title={t("notifications.rows.lowAvailability.title")}
              subtitle={t("notifications.rows.lowAvailability.subtitle")}
              rightElement={renderSwitch("notifyLowAvailability")}
            />
          </SettingsSection>
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SettingsSection label={t("notifications.sections.activity")}>
            <SettingsRow
              title={t("notifications.rows.newFollower.title")}
              subtitle={t("notifications.rows.newFollower.subtitle")}
              rightElement={renderSwitch("notifyNewFollower")}
            />
            <View style={styles.divider} />
            <SettingsRow
              title={t("notifications.rows.reviewUpvote.title")}
              subtitle={t("notifications.rows.reviewUpvote.subtitle")}
              rightElement={renderSwitch("notifyReviewUpvote")}
            />
            <View style={styles.divider} />
            <SettingsRow
              title={t("notifications.rows.recommendation.title")}
              subtitle={t("notifications.rows.recommendation.subtitle")}
              rightElement={renderSwitch("notifyRecommendation")}
            />
          </SettingsSection>

          <SettingsSection label={t("notifications.sections.bookings")}>
            <SettingsRow
              title={t("notifications.rows.bookingConfirmed.title")}
              subtitle={t("notifications.rows.bookingConfirmed.subtitle")}
              rightElement={renderSwitch("notifyBookingConfirmed")}
            />
            <View style={styles.divider} />
            <SettingsRow
              title={t("notifications.rows.bookingCancelled.title")}
              subtitle={t("notifications.rows.bookingCancelled.subtitle")}
              rightElement={renderSwitch("notifyBookingCancelled")}
            />
          </SettingsSection>

          <SettingsSection label={t("notifications.sections.general")}>
            <SettingsRow
              title={t("notifications.rows.promotions.title")}
              subtitle={t("notifications.rows.promotions.subtitle")}
              rightElement={renderSwitch("notifyPromotions")}
            />
            <View style={styles.divider} />
            <SettingsRow
              title={t("notifications.rows.systemUpdates.title")}
              subtitle={t("notifications.rows.systemUpdates.subtitle")}
              rightElement={renderSwitch("notifySystemUpdates")}
            />
          </SettingsSection>
        </ScrollView>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
    },
    section: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.xl,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: spacing.sm,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    sectionCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginLeft: spacing.md,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: 14,
      gap: spacing.md,
    },
    rowContent: {
      flex: 1,
    },
    rowTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 2,
    },
    rowSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });
}
