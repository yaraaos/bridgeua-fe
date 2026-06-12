import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { useSettings } from "@/src/features/settings/hooks/useSettings";
import { useMyBusinessProfile } from "@/src/features/businesses/hooks/useBusiness";
import { deleteBusiness } from "@/src/features/businesses/services/business.service";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useAppStore } from "@/src/store/app.store";
import { useAuthStore } from "@/src/store/auth.store";
import { useAccountStore } from "@/src/store/account.store";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

// ─── Types ───────────────────────────────────────────────────────────────────

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

type SettingsRowProps = {
  icon: FeatherIconName;
  title: string;
  subtitle: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
};

// ─── SettingsRow ─────────────────────────────────────────────────────────────

function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
}: SettingsRowProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}
    >
      <View style={styles.iconWrap}>
        <Feather name={icon} size={18} color={colors.primaryGreen} />
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      {rightElement !== undefined ? (
        rightElement
      ) : (
        <Feather name="chevron-right" size={18} color={colors.textMuted} />
      )}
    </Pressable>
  );
}

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

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const { colors, isDark } = useAppTheme();
  const styles = createStyles(colors);

  const router = useRouter();
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const clearUser = useAuthStore((state) => state.clearUser);
  const accountType = useAuthStore((state) => state.user?.accountType);
  const isAdmin = useAuthStore((state) => state.user?.isAdmin);
  const { settings, updateSetting } = useSettings();

  const [isDeletingBusiness, setIsDeletingBusiness] = useState(false);
  const { business } = useMyBusinessProfile();
  const handleDeleteBusiness = () => {
    if (!business?.id || isDeletingBusiness) return;

    Alert.alert(
      "Delete business?",
      "This will permanently delete your business profile. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeletingBusiness(true);
              await deleteBusiness(business.id);
              const currentUser = useAuthStore.getState().user;
              if (currentUser?.id) {
                await useAccountStore.getState().removeAccount(String(currentUser.id));
              }
              await clearUser();
              router.replace("/auth/sign-in");
            } catch (error) {
              Alert.alert(
                "Could not delete business",
                error instanceof Error
                  ? error.message
                  : "Please try again later.",
              );
            } finally {
              setIsDeletingBusiness(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.safeArea}>
      <ScreenHeader
        title="Settings"
        titleSubtitle="Manage your preferences and account"
        onBack={() => router.back()}
      />

      {/* Scrollable content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Admin */}
        {isAdmin && (
          <SettingsSection label="Admin">
            <SettingsRow
              icon="users"
              title="Users"
              subtitle="Manage personal and business accounts"
              onPress={() => router.push({ pathname: "/admin" } as any)}
            />
          </SettingsSection>
        )}

        {/* Account */}
        <SettingsSection label="Account">
          <SettingsRow
            icon="user"
            title="Profile"
            subtitle="View and edit your profile"
            onPress={() => router.push(accountType === "business" ? "/business/edit" : "/profile/edit")}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="lock"
            title="Account & Security"
            subtitle="Manage your account and password"
            onPress={() => router.push("/settings/account")}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="credit-card"
            title="Payment Methods"
            subtitle="Manage your saved payment methods"
            onPress={() => router.push("/settings/payment-methods")}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="bell"
            title="Notifications"
            subtitle="Manage your notification preferences"
            onPress={() => router.push("/settings/notifications")}
          />
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection label="Preferences">
          <SettingsRow
            icon="globe"
            title="Language"
            subtitle="Choose your preferred language"
            onPress={() => router.push("/settings/language")}
            rightElement={
              <View style={styles.rowRight}>
                <Text style={styles.rowValue}>
                  {settings?.language === "uk" ? "Українська" : "English"}
                </Text>
                <Feather
                  name="chevron-right"
                  size={18}
                  color={colors.textMuted}
                />
              </View>
            }
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="moon"
            title="Dark Mode"
            subtitle="Adjust your appearance"
            rightElement={
              <Switch
                value={isDark}
                onValueChange={(val) => setThemeMode(val ? "dark" : "light")}
                trackColor={{
                  false: colors.textMuted,
                  true: colors.primaryGreen,
                }}
                thumbColor={colors.white}
                ios_backgroundColor={colors.textMuted}
              />
            }
          />
        </SettingsSection>

        {/* Business */}
        {accountType === "business" && (
          <SettingsSection label="Business">
            <SettingsRow
              icon="refresh-cw"
              title="Auto-confirm Bookings"
              subtitle="Automatically confirm new booking requests"
              rightElement={
                <Switch
                  value={settings?.bookingAutoConfirm ?? false}
                  onValueChange={(val) => updateSetting("bookingAutoConfirm", val)}
                  trackColor={{ false: colors.textMuted, true: colors.primaryGreen }}
                  thumbColor={colors.white}
                  ios_backgroundColor={colors.textMuted}
                />
              }
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="map-pin"
              title="Show in Discovery"
              subtitle="Display your business on the map and search"
              rightElement={
                <Switch
                  value={settings?.profileVisible ?? true}
                  onValueChange={(val) => updateSetting("profileVisible", val)}
                  trackColor={{ false: colors.textMuted, true: colors.primaryGreen }}
                  thumbColor={colors.white}
                  ios_backgroundColor={colors.textMuted}
                />
              }
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="tag"
              title="Show Price Level"
              subtitle="Display price level on your business profile"
              rightElement={
                <Switch
                  value={settings?.showPriceLevel ?? true}
                  onValueChange={(val) => updateSetting("showPriceLevel", val)}
                  trackColor={{ false: colors.textMuted, true: colors.primaryGreen }}
                  thumbColor={colors.white}
                  ios_backgroundColor={colors.textMuted}
                />
              }
            />
          </SettingsSection>
        )}

        {/* Support */}
        <SettingsSection label="Support">
          <SettingsRow
            icon="help-circle"
            title="Help Center"
            subtitle="Find answers to common questions"
            onPress={() => router.push("/settings/help")}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="message-circle"
            title="Contact Us"
            subtitle="Get in touch with our support team"
            onPress={() => router.push("/settings/contact")}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="shield"
            title="Privacy Policy"
            subtitle="Read how we protect your data"
            onPress={() => router.push("/settings/privacy")}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="file-text"
            title="Terms of Service"
            subtitle="Read our terms and conditions"
            onPress={() => router.push("/settings/terms")}
          />
        </SettingsSection>

        {/* Log Out */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutBtn,
            pressed && styles.logoutPressed,
          ]}
          onPress={async () => {
            const currentUser = useAuthStore.getState().user;
            if (currentUser?.id) {
              await useAccountStore.getState().removeAccount(String(currentUser.id));
            }
            await clearUser();
            router.replace("/auth/sign-in");
          }}
        >
          <Feather name="log-out" size={18} color={colors.accentOrange} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        <Text style={styles.version}>Version 2.4.7</Text>
      </ScrollView>
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
      marginLeft: 56,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: 14,
      gap: spacing.md,
    },
    rowPressed: {
      backgroundColor: colors.background,
    },
    iconWrap: {
      width: 36,
      height: 36,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primaryGreenSoft,
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
    rowRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    rowValue: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    logoutBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      paddingVertical: 14,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    logoutPressed: {
      backgroundColor: colors.background,
    },
    logoutText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.accentOrange,
    },

    deleteBusinessBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      paddingVertical: 14,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.error,
      backgroundColor: colors.surface,
    },
    deleteBusinessText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.error,
    },
    disabledBtn: {
      opacity: 0.6,
    },

    version: {
      textAlign: "center",
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: spacing.xl,
    },
  });
}
