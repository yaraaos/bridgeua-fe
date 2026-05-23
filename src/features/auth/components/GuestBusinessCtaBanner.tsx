import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function GuestBusinessCtaBanner() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const handlePress = () => {
    router.push({
      pathname: "/auth/sign-in",
      params: {
        source: "guest_business_cta",
        action: "promotion",
      },
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.textWrap}>
        <AppText style={styles.title}>
          Follow businesses to unlock promos
        </AppText>
        <AppText style={styles.description}>
          Become a user to follow this business, receive updates, and see
          promotions from places you trust.
        </AppText>
      </View>

      <AppButton title="Become a user" onPress={handlePress} />
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      padding: spacing.lg,
      borderRadius: radius.xl,
      backgroundColor: colors.primaryGreenSoft,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.md,
    },

    title: {
      fontSize: 17,
      lineHeight: 22,
      fontWeight: "800",
      color: colors.textPrimary,
    },

    description: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSecondary,
    },

    textWrap: {
      gap: spacing.xs,
    },
  });
}
