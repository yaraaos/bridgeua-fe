import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function AboutScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const router = useRouter();

  const version = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <View style={styles.safeArea}>
      <ScreenHeader title="About" onBack={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.appName}>BridgeUA</Text>
          <Text style={styles.version}>Version {version}</Text>
          <Text style={styles.tagline}>
            Connecting Ukrainian communities with local businesses.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <Pressable
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
              onPress={() => router.push("/settings/privacy")}
            >
              <Text style={styles.rowTitle}>Privacy Policy</Text>
              <Text style={styles.rowChevron}>›</Text>
            </Pressable>
            <View style={styles.divider} />
            <Pressable
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
              onPress={() => router.push("/settings/terms")}
            >
              <Text style={styles.rowTitle}>Terms of Service</Text>
              <Text style={styles.rowChevron}>›</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.copyright}>
          © {new Date().getFullYear()} BridgeUA. All rights reserved.
        </Text>
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
      paddingTop: spacing.xl,
      paddingBottom: spacing.xl,
    },
    hero: {
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.xl,
      gap: spacing.sm,
    },
    appName: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.primaryGreen,
      letterSpacing: 0.5,
    },
    version: {
      fontSize: 13,
      color: colors.textMuted,
    },
    tagline: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
      marginTop: spacing.xs,
    },
    section: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.xl,
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
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.md,
      paddingVertical: 14,
    },
    rowPressed: {
      backgroundColor: colors.background,
    },
    rowTitle: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.textPrimary,
    },
    rowChevron: {
      fontSize: 20,
      color: colors.textMuted,
    },
    copyright: {
      textAlign: "center",
      fontSize: 12,
      color: colors.textMuted,
      paddingHorizontal: spacing.lg,
    },
  });
}
