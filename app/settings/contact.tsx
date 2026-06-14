import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

export default function ContactScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const { t } = useTranslation();

  const contactItems: {
    icon: FeatherIconName;
    label: string;
    value: string;
    url: string;
  }[] = [
    {
      icon: "mail",
      label: t("contact.email"),
      value: "support@bridgeua.com",
      url: "mailto:support@bridgeua.com",
    },
    {
      icon: "phone",
      label: t("contact.phone"),
      value: "+380 00 000 0000",
      url: "tel:+380000000000",
    },
    {
      icon: "instagram",
      label: t("contact.instagram"),
      value: "@bridgeua",
      url: "https://instagram.com/bridgeua",
    },
    {
      icon: "facebook",
      label: t("contact.facebook"),
      value: "BridgeUA",
      url: "https://facebook.com/bridgeua",
    },
    {
      icon: "send",
      label: t("contact.telegram"),
      value: "@bridgeua",
      url: "https://t.me/bridgeua",
    },
  ];

  return (
    <View style={styles.safeArea}>
      <ScreenHeader title={t("contact.title")} onBack={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionCard}>
          {contactItems.map((item, index) => (
            <View key={item.label}>
              {index > 0 && <View style={styles.divider} />}
              <Pressable
                style={({ pressed }) => [
                  styles.row,
                  pressed && styles.rowPressed,
                ]}
                onPress={() => Linking.openURL(item.url)}
              >
                <View style={styles.iconWrap}>
                  <Feather name={item.icon} size={18} color={colors.primaryGreen} />
                </View>
                <View style={styles.rowContent}>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  <Text style={styles.rowValue}>{item.value}</Text>
                </View>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

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
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
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
    rowLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    rowValue: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.textPrimary,
    },
  });
}
