import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { apiClient } from "@/src/services/api/client";
import { ENDPOINTS } from "@/src/services/api/endpoints";
import { useAccountStore } from "@/src/store/account.store";
import { useAuthStore } from "@/src/store/auth.store";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

// ─── SettingsSection ─────────────────────────────────────────────────────────

function SettingsSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function AccountScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const router = useRouter();

  const accountType = useAuthStore((state) => state.user?.accountType);

  const [emailOpen, setEmailOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  // Email form
  const [emailCurrentPassword, setEmailCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  function resetEmailForm() {
    setEmailCurrentPassword("");
    setNewEmail("");
  }

  function resetPasswordForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
  }

  async function handleUpdateEmail() {
    setEmailLoading(true);
    try {
      const response = await apiClient.patch(ENDPOINTS.ACCOUNT_EMAIL, {
        currentPassword: emailCurrentPassword,
        newEmail,
      });
      console.log('ACCOUNT_EMAIL response:', response);
      resetEmailForm();
      setEmailOpen(false);
      router.push({ pathname: "/settings/confirm-email" as never, params: { email: newEmail } });
    } catch (err: unknown) {
      Alert.alert(
        "Could not update email",
        err instanceof Error ? err.message : "Please try again later.",
      );
    } finally {
      setEmailLoading(false);
    }
  }

  async function handleUpdatePassword() {
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordError(null);
    setPasswordLoading(true);
    try {
      await apiClient.patch(ENDPOINTS.ACCOUNT_PASSWORD, {
        currentPassword,
        newPassword,
      });
      Alert.alert("Password updated successfully");
      resetPasswordForm();
      setPasswordOpen(false);
    } catch (err: unknown) {
      Alert.alert(
        "Could not update password",
        err instanceof Error ? err.message : "Please try again later.",
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  function handleDeleteAccount() {
    Alert.alert(
      "Delete account?",
      "This will permanently delete your account and all your data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiClient.delete(ENDPOINTS.ACCOUNT_DELETE);
              const currentUser = useAuthStore.getState().user;
              if (currentUser?.id) {
                await useAccountStore
                  .getState()
                  .removeAccount(String(currentUser.id));
              }
              await useAuthStore.getState().clearUser();
              router.replace("/auth/sign-in");
            } catch (err: unknown) {
              Alert.alert(
                "Could not delete account",
                err instanceof Error ? err.message : "Please try again later.",
              );
            }
          },
        },
      ],
    );
  }

  return (
    <View style={styles.safeArea}>
      <ScreenHeader
        title="Account & Security"
        titleSubtitle="Manage your credentials"
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Credentials */}
        <SettingsSection label="Credentials">
          {/* Change Email */}
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={() => {
              setEmailOpen((v) => !v);
              resetEmailForm();
            }}
          >
            <View style={styles.iconWrap}>
              <Feather name="mail" size={18} color={colors.primaryGreen} />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>Change Email</Text>
              <Text style={styles.rowSubtitle}>Update your email address</Text>
            </View>
            <Feather
              name={emailOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.textMuted}
            />
          </Pressable>

          {emailOpen && (
            <View style={styles.formPanel}>
              <TextInput
                style={styles.input}
                placeholder="Current password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                value={emailCurrentPassword}
                onChangeText={setEmailCurrentPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="New email address"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={newEmail}
                onChangeText={(value) => setNewEmail(value.toLowerCase().trim())}
              />
              <Pressable
                style={({ pressed }) => [
                  styles.submitBtn,
                  pressed && styles.submitBtnPressed,
                ]}
                onPress={handleUpdateEmail}
                disabled={emailLoading}
              >
                {emailLoading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.submitBtnText}>Update Email</Text>
                )}
              </Pressable>
            </View>
          )}

          <View style={styles.divider} />

          {/* Change Password */}
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={() => {
              setPasswordOpen((v) => !v);
              resetPasswordForm();
            }}
          >
            <View style={styles.iconWrap}>
              <Feather name="lock" size={18} color={colors.primaryGreen} />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>Change Password</Text>
              <Text style={styles.rowSubtitle}>Update your password</Text>
            </View>
            <Feather
              name={passwordOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.textMuted}
            />
          </Pressable>

          {passwordOpen && (
            <View style={styles.formPanel}>
              <TextInput
                style={styles.input}
                placeholder="Current password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="New password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                value={newPassword}
                onChangeText={(val) => {
                  setNewPassword(val);
                  setPasswordError(null);
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                value={confirmPassword}
                onChangeText={(val) => {
                  setConfirmPassword(val);
                  setPasswordError(null);
                }}
              />
              {passwordError && (
                <Text style={styles.errorText}>{passwordError}</Text>
              )}
              <Pressable
                style={({ pressed }) => [
                  styles.submitBtn,
                  pressed && styles.submitBtnPressed,
                ]}
                onPress={handleUpdatePassword}
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.submitBtnText}>Update Password</Text>
                )}
              </Pressable>
            </View>
          )}
        </SettingsSection>

        {/* Business Details */}
        {accountType === "business" && (
          <SettingsSection label="Business Details">
            <Pressable
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
              onPress={() =>
                Linking.openURL(
                  "mailto:support@bridgeua.com?subject=Request%20to%20Change%20Business%20Name",
                )
              }
            >
              <View style={styles.iconWrap}>
                <Feather
                  name="briefcase"
                  size={18}
                  color={colors.primaryGreen}
                />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Change Business Name</Text>
                <Text style={styles.rowSubtitle}>
                  Request a name change for your business
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={18}
                color={colors.textMuted}
              />
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
              onPress={() =>
                Linking.openURL(
                  "mailto:support@bridgeua.com?subject=Request%20to%20Change%20Business%20Category",
                )
              }
            >
              <View style={styles.iconWrap}>
                <Feather name="grid" size={18} color={colors.primaryGreen} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Change Business Category</Text>
                <Text style={styles.rowSubtitle}>
                  Request a category change for your business
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={18}
                color={colors.textMuted}
              />
            </Pressable>
          </SettingsSection>
        )}

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Pressable
            style={({ pressed }) => [
              styles.deleteBtn,
              pressed && styles.deleteBtnPressed,
            ]}
            onPress={handleDeleteAccount}
          >
            <Feather name="trash-2" size={18} color={colors.error} />
            <Text style={styles.deleteBtnText}>Delete Account</Text>
          </Pressable>
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
    rowTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 2,
    },
    rowSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    formPanel: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      gap: spacing.sm,
    },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: 10,
      fontSize: 14,
      color: colors.textPrimary,
    },
    errorText: {
      fontSize: 12,
      color: colors.error,
    },
    submitBtn: {
      backgroundColor: colors.primaryGreen,
      borderRadius: radius.md,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
      marginTop: spacing.xs,
    },
    submitBtnPressed: {
      opacity: 0.85,
    },
    submitBtnText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.white,
    },
    dangerSection: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.xl,
    },
    deleteBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      paddingVertical: 14,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.error,
      backgroundColor: colors.surface,
    },
    deleteBtnPressed: {
      backgroundColor: colors.background,
    },
    deleteBtnText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.error,
    },
  });
}
