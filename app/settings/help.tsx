import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ─── SettingsRow ──────────────────────────────────────────────────────────────

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

function SettingsRow({
  icon,
  title,
  onPress,
}: {
  icon: FeatherIconName;
  title: string;
  onPress: () => void;
}) {
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
      <Text style={styles.rowTitle}>{title}</Text>
      <Feather name="chevron-right" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function HelpScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const { t } = useTranslation();

  const faqItems = t("help.faq", { returnObjects: true }) as { question: string; answer: string }[];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <View style={styles.safeArea}>
      <ScreenHeader title={t("help.title")} onBack={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t("help.sections.faq")}</Text>
          <View style={styles.sectionCard}>
            {faqItems.map((item, index) => (
              <View key={index}>
                {index > 0 && <View style={styles.divider} />}
                <Pressable
                  style={({ pressed }) => [
                    styles.faqRow,
                    pressed && styles.rowPressed,
                  ]}
                  onPress={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                >
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <Feather
                    name={activeIndex === index ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={colors.textMuted}
                  />
                </Pressable>
                {activeIndex === index && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{item.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t("help.sections.contact")}</Text>
          <View style={styles.sectionCard}>
            <SettingsRow
              icon="mail"
              title={t("help.contact.emailSupport")}
              onPress={() => Linking.openURL("mailto:support@bridgeua.com?subject=Support%20Request")}
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="alert-circle"
              title={t("help.contact.reportBug")}
              onPress={() =>
                Linking.openURL(
                  "mailto:support@bridgeua.com?subject=Bug%20Report",
                )
              }
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="message-circle"
              title={t("help.contact.contactUs")}
              onPress={() =>
                Linking.openURL(
                  "mailto:support@bridgeua.com?subject=General%20Enquiry",
                )
              }
            />
          </View>
        </View>
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
    },
    faqRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: 14,
      gap: spacing.md,
    },
    rowPressed: {
      backgroundColor: colors.background,
    },
    faqQuestion: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    faqAnswer: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
    },
    faqAnswerText: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: 14,
      gap: spacing.md,
    },
    iconWrap: {
      width: 36,
      height: 36,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primaryGreenSoft,
    },
    rowTitle: {
      flex: 1,
      fontSize: 15,
      fontWeight: "600",
      color: colors.textPrimary,
    },
  });
}
