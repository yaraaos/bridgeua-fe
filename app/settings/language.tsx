import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { useSettings } from "@/src/features/settings/hooks/useSettings";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

const LANGUAGES: { label: string; value: "en" | "uk" }[] = [
  { label: "English", value: "en" },
  { label: "Українська", value: "uk" },
];

export default function LanguageScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const { settings, isLoading, updateSetting } = useSettings();

  const selected = settings?.language ?? "en";

  return (
    <View style={styles.safeArea}>
      <ScreenHeader title="Language" onBack={() => router.back()} />

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primaryGreen} />
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.sectionCard}>
            {LANGUAGES.map((lang, index) => (
              <View key={lang.value}>
                {index > 0 && <View style={styles.divider} />}
                <Pressable
                  style={({ pressed }) => [
                    styles.row,
                    pressed && styles.rowPressed,
                  ]}
                  onPress={() => updateSetting("language", lang.value)}
                >
                  <Text style={styles.rowLabel}>{lang.label}</Text>
                  {selected === lang.value && (
                    <Feather
                      name="check"
                      size={18}
                      color={colors.primaryGreen}
                    />
                  )}
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}
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
    },
    content: {
      paddingTop: spacing.lg,
      paddingHorizontal: spacing.lg,
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
      paddingVertical: 16,
    },
    rowPressed: {
      backgroundColor: colors.background,
    },
    rowLabel: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.textPrimary,
    },
  });
}
