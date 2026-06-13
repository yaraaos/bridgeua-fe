import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useAccountStore, useActiveAccount } from "@/src/store/account.store";
import { useAuthStore } from "@/src/store/auth.store";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import BusinessProfileScreen from "../profile/business";
import PersonalProfileScreen from "../profile/personal";

export default function ProfileTabScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const isGuest = useAuthStore((state) => state.isGuest);
  const user = useAuthStore((state) => state.user);
  const account = useActiveAccount();
  const isHydrated = useAccountStore((s) => s.isHydrated);

  const effectiveAccountKind = account?.kind ?? user?.accountType ?? "personal";

  const handleRegisterPress = () => {
    router.replace({
      pathname: "/auth/sign-in",
      params: {
        source: "guest_profile_tab",
        action: "profile",
      },
    });
  };

  const guestBenefits = [
    t("profile.guest.benefits.follow"),
    t("profile.guest.benefits.promotions"),
    t("profile.guest.benefits.reviews"),
    t("profile.guest.benefits.notifications"),
  ];

  if (isGuest) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title={t("profile.guest.headerTitle")}
          titleSubtitle={t("profile.guest.headerSubtitle")}
          headerInnerStyle={styles.headerInner}
        />

        <View style={styles.content}>
          <View style={styles.card}>
            <AppText style={styles.title}>{t("profile.guest.cardTitle")}</AppText>
            <AppText style={styles.description}>
              {t("profile.guest.cardDescription")}
            </AppText>

            <View style={styles.benefitsList}>
              {guestBenefits.map((benefit) => (
                <View key={benefit} style={styles.benefitRow}>
                  <View style={styles.bullet} />
                  <AppText style={styles.benefitText}>{benefit}</AppText>
                </View>
              ))}
            </View>

            <AppButton
              title={t("profile.guest.registerButton")}
              onPress={handleRegisterPress}
            />
          </View>
        </View>
      </View>
    );
  }

  if (!isHydrated) {
    return null;
  }

  if (effectiveAccountKind === "business") {
    return <BusinessProfileScreen />;
  }

  return <PersonalProfileScreen />;
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    headerInner: {
      paddingHorizontal: spacing.lg,
    },

    content: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
    },

    card: {
      padding: spacing.lg,
      borderRadius: 24,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.md,
    },

    title: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: "800",
      color: colors.textPrimary,
    },

    description: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
    },

    benefitsList: {
      gap: spacing.sm,
      marginVertical: spacing.sm,
    },

    benefitRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },

    bullet: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: colors.primaryGreen,
    },

    benefitText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
      color: colors.textPrimary,
      fontWeight: "600",
    },
  });
}
