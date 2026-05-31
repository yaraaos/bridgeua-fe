import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { apiClient } from "@/src/services/api/client";
import { ENDPOINTS } from "@/src/services/api/endpoints";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ConfirmEmailScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const { email: newEmail } = useLocalSearchParams<{ email: string }>();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setError(null);
    setLoading(true);
    try {
      await apiClient.patch(ENDPOINTS.ACCOUNT_CONFIRM_EMAIL, { code });
      Alert.alert("Email updated successfully", undefined, [
        { text: "OK", onPress: () => router.replace("/settings") },
      ]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.safeArea}>
      <ScreenHeader title="Confirm Email" onBack={() => router.back()} />

      <View style={styles.content}>
        <Text style={styles.instructions}>
          We sent a confirmation code to{" "}
          <Text style={styles.email}>{newEmail}</Text>
        </Text>

        <TextInput
          style={styles.input}
          placeholder="6-digit code"
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          maxLength={6}
          value={code}
          onChangeText={(val) => {
            setCode(val);
            setError(null);
          }}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            pressed && styles.submitBtnPressed,
          ]}
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.submitBtnText}>Confirm</Text>
          )}
        </Pressable>
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
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      gap: spacing.md,
    },
    instructions: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: spacing.sm,
    },
    email: {
      fontWeight: "600",
      color: colors.textPrimary,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
      fontSize: 20,
      letterSpacing: 6,
      color: colors.textPrimary,
      textAlign: "center",
    },
    errorText: {
      fontSize: 13,
      color: colors.error,
    },
    submitBtn: {
      backgroundColor: colors.primaryGreen,
      borderRadius: radius.md,
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
      marginTop: spacing.sm,
    },
    submitBtnPressed: {
      opacity: 0.85,
    },
    submitBtnText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.white,
    },
  });
}
