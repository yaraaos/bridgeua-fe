import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useAuthStore } from "@/src/store/auth.store";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import BusinessProfileScreen from "../profile/business";
import PersonalProfileScreen from "../profile/personal";

// temporary FE-only mock
const MOCK_ACCOUNT_TYPE = "personal"; // "personal" | "business"

const GUEST_BENEFITS = [
  "Follow trusted businesses",
  "Receive promotions and news",
  "Leave recommendations and reviews",
  "Get activity notifications",
];

export default function ProfileTabScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const isGuest = useAuthStore((state) => state.isGuest);

  const handleRegisterPress = () => {
    router.push("/auth/sign-in");
  };

  if (isGuest) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Join BridgeUA"
          titleSubtitle="Create your profile and connect with trusted businesses"
          headerInnerStyle={styles.headerInner}
        />

        <View style={styles.content}>
          <View style={styles.card}>
            <AppText style={styles.title}>Register to BridgeUA</AppText>
            <AppText style={styles.description}>
              Create an account to follow businesses, see personalized updates,
              receive promotions, and share your recommendations with the
              community.
            </AppText>

            <View style={styles.benefitsList}>
              {GUEST_BENEFITS.map((benefit) => (
                <View key={benefit} style={styles.benefitRow}>
                  <View style={styles.bullet} />
                  <AppText style={styles.benefitText}>{benefit}</AppText>
                </View>
              ))}
            </View>

            <AppButton
              title="Register to BridgeUA"
              onPress={handleRegisterPress}
            />
          </View>
        </View>
      </View>
    );
  }

  if (MOCK_ACCOUNT_TYPE === "personal") {
    return <PersonalProfileScreen />;
  }

  return <BusinessProfileScreen />;
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
