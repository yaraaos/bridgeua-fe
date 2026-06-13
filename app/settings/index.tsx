import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { useSettings } from "@/src/features/settings/hooks/useSettings";

import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useAppStore } from "@/src/store/app.store";
import { useAuthStore } from "@/src/store/auth.store";
import { useAccountStore } from "@/src/store/account.store";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
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

  const { t, i18n } = useTranslation();
  const router = useRouter();
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const clearUser = useAuthStore((state) => state.clearUser);
  const accountType = useAuthStore((state) => state.user?.accountType);
  const isAdmin = useAuthStore((state) => state.user?.isAdmin);
  const { settings, updateSetting } = useSettings();

  const themeOverlayColor = useRef(colors.background);
  const themeOverlayOpacity = useRef(new Animated.Value(0)).current;

  const handleThemeChange = (val: boolean) => {
    themeOverlayColor.current = colors.background;
    themeOverlayOpacity.setValue(1);
    setThemeMode(val ? "dark" : "light");
    Animated.timing(themeOverlayOpacity, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.safeArea}>
      <ScreenHeader
        title={t("settings.title")}
        titleSubtitle={t("settings.subtitle")}
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isAdmin && (
          <SettingsSection label={t("settings.sections.admin")}>
            <SettingsRow
              icon="users"
              title={t("settings.rows.users.title")}
              subtitle={t("settings.rows.users.subtitle")}
              onPress={() => router.push({ pathname: "/admin" } as any)}
            />
          </SettingsSection>
        )}

        <SettingsSection label={t("settings.sections.account")}>
          <SettingsRow
            icon="user"
            title={t("settings.rows.profile.title")}
            subtitle={t("settings.rows.profile.subtitle")}
            onPress={() => router.push(accountType === "business" ? "/business/edit" : "/profile/edit")}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="lock"
            title={t("settings.rows.security.title")}
            subtitle={t("settings.rows.security.subtitle")}
            onPress={() => router.push("/settings/account")}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="credit-card"
            title={t("settings.rows.payment.title")}
            subtitle={t("settings.rows.payment.subtitle")}
            onPress={() => router.push("/settings/payment-methods")}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="bell"
            title={t("settings.rows.notifications.title")}
            subtitle={t("settings.rows.notifications.subtitle")}
            onPress={() => router.push("/settings/notifications")}
          />
        </SettingsSection>

        <SettingsSection label={t("settings.sections.preferences")}>
          <SettingsRow
            icon="globe"
            title={t("settings.rows.language.title")}
            subtitle={t("settings.rows.language.subtitle")}
            onPress={() => router.push("/settings/language")}
            rightElement={
              <View style={styles.rowRight}>
                <Text style={styles.rowValue}>
                  {i18n.language === "uk" ? t("common.ukrainian") : t("common.english")}
                </Text>
                <Feather name="chevron-right" size={18} color={colors.textMuted} />
              </View>
            }
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="moon"
            title={t("settings.rows.darkMode.title")}
            subtitle={t("settings.rows.darkMode.subtitle")}
            rightElement={
              <Switch
                value={isDark}
                onValueChange={handleThemeChange}
                trackColor={{ false: colors.textMuted, true: colors.primaryGreen }}
                thumbColor={colors.white}
                ios_backgroundColor={colors.textMuted}
              />
            }
          />
        </SettingsSection>

        {accountType === "business" && (
          <SettingsSection label={t("settings.sections.business")}>
            <SettingsRow
              icon="refresh-cw"
              title={t("settings.rows.autoConfirm.title")}
              subtitle={t("settings.rows.autoConfirm.subtitle")}
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
              title={t("settings.rows.discovery.title")}
              subtitle={t("settings.rows.discovery.subtitle")}
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
              title={t("settings.rows.priceLevel.title")}
              subtitle={t("settings.rows.priceLevel.subtitle")}
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

        <SettingsSection label={t("settings.sections.support")}>
          <SettingsRow
            icon="help-circle"
            title={t("settings.rows.help.title")}
            subtitle={t("settings.rows.help.subtitle")}
            onPress={() => router.push("/settings/help")}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="message-circle"
            title={t("settings.rows.contact.title")}
            subtitle={t("settings.rows.contact.subtitle")}
            onPress={() => router.push("/settings/contact")}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="shield"
            title={t("settings.rows.privacy.title")}
            subtitle={t("settings.rows.privacy.subtitle")}
            onPress={() => router.push("/settings/privacy")}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="file-text"
            title={t("settings.rows.terms.title")}
            subtitle={t("settings.rows.terms.subtitle")}
            onPress={() => router.push("/settings/terms")}
          />
        </SettingsSection>

        <Pressable
          style={({ pressed }) => [styles.logoutBtn, pressed && styles.logoutPressed]}
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
          <Text style={styles.logoutText}>{t("settings.logout")}</Text>
        </Pressable>

        <Text style={styles.version}>{t("settings.version", { version: "2.4.7" })}</Text>
      </ScrollView>

      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: themeOverlayColor.current, opacity: themeOverlayOpacity },
        ]}
      />
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

    version: {
      textAlign: "center",
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: spacing.xl,
    },
  });
}
