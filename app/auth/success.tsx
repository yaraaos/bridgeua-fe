import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import { AppColors } from "../../src/constants/colors";
import { useAppTheme } from "../../src/hooks/useAppTheme";

export default function AuthSuccessScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const { title, subtitle, ctaLabel, ctaRoute } = useLocalSearchParams<{
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaRoute?: string;
  }>();

  return (
    <AppScreen style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Feather name="check" size={40} color={colors.white} />
        </View>
        <Text style={styles.title}>{title || t("auth.success.defaultTitle")}</Text>
        <Text style={styles.subtitle}>
          {subtitle || t("auth.success.defaultSubtitle")}
        </Text>
      </View>

      <AppButton
        title={ctaLabel || t("auth.success.defaultCta")}
        onPress={() => router.replace((ctaRoute as any) || "/(tabs)/home")}
      />
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      justifyContent: "space-between",
      paddingVertical: 40,
    },

    content: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    iconWrap: {
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: colors.primaryGreen,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
    },

    title: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.textPrimary,
      textAlign: "center",
    },

    subtitle: {
      marginTop: 10,
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
      textAlign: "center",
    },
  });
}
