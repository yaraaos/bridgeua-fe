import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export default function PaymentMethodsScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={styles.safeArea}>
      <ScreenHeader title={t("payment.title")} onBack={() => router.back()} />
      <View style={styles.centered}>
        <Feather name="credit-card" size={48} color={colors.textMuted} />
        <Text style={styles.title}>{t("payment.comingSoon")}</Text>
        <Text style={styles.subtitle}>{t("payment.workingOnIt")}</Text>
      </View>
    </View>
  );
}

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
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
    },
    title: {
      fontSize: 17,
      fontWeight: "600",
      color: colors.textPrimary,
      textAlign: "center",
      marginTop: spacing.md,
    },
    subtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: "center",
    },
  });
}
