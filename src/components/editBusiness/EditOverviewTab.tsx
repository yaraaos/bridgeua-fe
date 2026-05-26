import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import AppButton from "@/src/components/ui/AppButton/AppButton";

import AppAvatar from "@/src/components/ui/AppAvatar/AppAvatar";
import AppInput from "@/src/components/ui/AppInput/AppInput";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { useEditBusiness } from "@/src/features/businesses/hooks/useEditBusiness";
import type {
  DayOfWeek,
  EditBusinessSocialLinks,
} from "@/src/features/businesses/types/editBusiness.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useFormValidation } from "@/src/hooks/useFormValidation";
import { useActiveAccount } from "@/src/store/account.store";
import { useEditBusinessStore } from "@/src/store/editBusiness.store";

import EditBusinessHourRow from "./EditBusinessHourRow";
import EditBusinessSocialRow from "./EditBusinessSocialRow";

const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const SOCIAL_ROWS: {
  key: keyof EditBusinessSocialLinks;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}[] = [
  { key: "website", icon: "globe-outline", label: "Website" },
  { key: "instagram", icon: "logo-instagram", label: "Instagram" },
  { key: "facebook", icon: "logo-facebook", label: "Facebook" },
  { key: "telegram", icon: "paper-plane-outline", label: "Telegram" },
  { key: "whatsapp", icon: "logo-whatsapp", label: "WhatsApp" },
];

type OverviewErrors = {
  address: boolean;
  postalCode: boolean;
  city: boolean;
  state: boolean;
};

const NO_ERRORS: OverviewErrors = {
  address: false,
  postalCode: false,
  city: false,
  state: false,
};

export default function EditOverviewTab() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const account = useActiveAccount();

  const draft = useEditBusinessStore((s) => s.overviewDraft);
  const isDirty = useEditBusinessStore((s) => s.dirty.overview);
  const markDirty = useEditBusinessStore((s) => s.markDirty);
  const setOverviewDraft = useEditBusinessStore((s) => s.setOverviewDraft);
  const updateOverviewHour = useEditBusinessStore((s) => s.updateOverviewHour);

  const scrollRef = useRef<ScrollView>(null);
  const fieldPositions = useRef<Record<string, number>>({});
  const hoursValidity = useRef<Record<string, boolean>>(
    Object.fromEntries(
      draft.hours.map((h) => [
        h.day,
        !h.isOpen || (h.openTime !== "" && h.closeTime !== ""),
      ]),
    ),
  );

  const { saveOverview, isSaving, saveError } = useEditBusiness();
  const { showError, errorMessage, triggerError, clearError } =
    useFormValidation();
  const [errors, setErrors] = useState<OverviewErrors>(NO_ERRORS);
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const displayedAvatarUrl = draft.avatarUrl || account.avatarUrl;

  async function handlePickAvatar() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo access to change your business profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const nextAvatarUrl = result.assets[0]?.uri;
    if (!nextAvatarUrl) return;

    setOverviewDraft({ avatarUrl: nextAvatarUrl });
    markDirty("overview");
  }

  const mandatoryFilled =
    draft.address.trim() !== "" &&
    draft.postalCode.trim() !== "" &&
    draft.city.trim() !== "" &&
    draft.state.trim() !== "";
  const canSave = isDirty && mandatoryFilled;

  function onField(key: keyof Omit<typeof draft, "socialLinks" | "hours">) {
    return (value: string) => {
      setOverviewDraft({ [key]: value });
      markDirty("overview");
      if (key in NO_ERRORS) {
        setErrors((prev) => ({ ...prev, [key]: false }));
        clearError();
      }
    };
  }

  function onSocialField(key: keyof EditBusinessSocialLinks) {
    return (value: string) => {
      setOverviewDraft({ socialLinks: { ...draft.socialLinks, [key]: value } });
      markDirty("overview");
    };
  }

  function onHourToggle(day: DayOfWeek, value: boolean) {
    updateOverviewHour(day, { isOpen: value });
    markDirty("overview");
  }

  function onHourTime(
    day: DayOfWeek,
    field: "openTime" | "closeTime",
    value: string,
  ) {
    updateOverviewHour(day, { [field]: value });
    markDirty("overview");
  }

  async function handleSave() {
    if (!isDirty) return;
    const newErrors: OverviewErrors = {
      address: draft.address.trim() === "",
      postalCode: draft.postalCode.trim() === "",
      city: draft.city.trim() === "",
      state: draft.state.trim() === "",
    };
    const allHoursValid = Object.values(hoursValidity.current).every(Boolean);

    if (Object.values(newErrors).some(Boolean) || !allHoursValid) {
      setErrors(newErrors);
      triggerError("Fill in the required fields");
      const firstInvalidKey = (
        ["address", "postalCode", "city", "state"] as const
      ).find((k) => newErrors[k]);
      if (firstInvalidKey !== undefined) {
        scrollRef.current?.scrollTo({
          y: (fieldPositions.current[firstInvalidKey] ?? 0) - spacing.lg,
          animated: true,
        });
      }
      return;
    }
    setErrors(NO_ERRORS);
    const result = await saveOverview();
    if (result.ok) {
      clearError();
      if (successTimer.current) clearTimeout(successTimer.current);
      setShowSuccess(true);
      successTimer.current = setTimeout(() => setShowSuccess(false), 3000);
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContent}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 96 : 0}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets
        >
          {/* Business Profile Photo */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <AppAvatar
                imageUrl={displayedAvatarUrl}
                name={account.displayName}
                size="lg"
              />
              <Pressable
                style={styles.avatarEditBtn}
                onPress={handlePickAvatar}
              >
                <Ionicons
                  name="camera-outline"
                  size={14}
                  color={colors.white}
                />
              </Pressable>
            </View>
          </View>

          {/* Business Information */}
          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Business Information</AppText>

            <View style={styles.fieldGroup}>
              <AppText style={styles.fieldLabel}>Business Name</AppText>
              <View style={styles.readOnlyField}>
                <AppText style={styles.readOnlyValue} numberOfLines={1}>
                  {account.displayName}
                </AppText>
                <Ionicons
                  name="lock-closed-outline"
                  size={14}
                  color={colors.textMuted}
                />
              </View>
              <AppText style={styles.readOnlyCaption}>
                Set during registration. Contact support to change.
              </AppText>
            </View>

            <View style={styles.fieldGroup}>
              <AppText style={styles.fieldLabel}>Category</AppText>
              <View style={styles.readOnlyField}>
                <AppText style={styles.readOnlyValue} numberOfLines={1}>
                  {draft.category || "—"}
                </AppText>
                <Ionicons
                  name="lock-closed-outline"
                  size={14}
                  color={colors.textMuted}
                />
              </View>
              <AppText style={styles.readOnlyCaption}>
                Set during registration. Contact support to change.
              </AppText>
            </View>

            <View style={styles.addressRow}>
              <View
                style={[styles.fieldGroup, styles.addressField]}
                onLayout={(e) => {
                  fieldPositions.current["address"] = e.nativeEvent.layout.y;
                }}
              >
                <AppText style={styles.fieldLabel}>Address</AppText>
                <AppInput
                  value={draft.address}
                  onChangeText={onField("address")}
                  placeholder="Street address"
                  error={errors.address}
                />
                {errors.address && (
                  <AppText style={styles.errorText}>
                    This field is required
                  </AppText>
                )}
              </View>
              <View
                style={[styles.fieldGroup, styles.postalField]}
                onLayout={(e) => {
                  fieldPositions.current["postalCode"] = e.nativeEvent.layout.y;
                }}
              >
                <AppText style={styles.fieldLabel}>Postal Code</AppText>
                <AppInput
                  value={draft.postalCode}
                  onChangeText={onField("postalCode")}
                  placeholder="10001"
                  keyboardType="numeric"
                  error={errors.postalCode}
                />
                {errors.postalCode && (
                  <AppText style={styles.errorText}>Required</AppText>
                )}
              </View>
            </View>

            <View style={styles.halfRow}>
              <View
                style={[styles.fieldGroup, styles.halfField]}
                onLayout={(e) => {
                  fieldPositions.current["city"] = e.nativeEvent.layout.y;
                }}
              >
                <AppText style={styles.fieldLabel}>City</AppText>
                <AppInput
                  value={draft.city}
                  onChangeText={onField("city")}
                  placeholder="City"
                  error={errors.city}
                />
                {errors.city && (
                  <AppText style={styles.errorText}>
                    This field is required
                  </AppText>
                )}
              </View>
              <View
                style={[styles.fieldGroup, styles.halfField]}
                onLayout={(e) => {
                  fieldPositions.current["state"] = e.nativeEvent.layout.y;
                }}
              >
                <AppText style={styles.fieldLabel}>State / Region</AppText>
                <AppInput
                  value={draft.state}
                  onChangeText={onField("state")}
                  placeholder="State"
                  error={errors.state}
                />
                {errors.state && (
                  <AppText style={styles.errorText}>
                    This field is required
                  </AppText>
                )}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <AppText style={styles.fieldLabel}>Phone Number</AppText>
              <AppInput
                value={draft.phone}
                onChangeText={onField("phone")}
                placeholder="+1 (555) 000-0000"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Social Links */}
          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Social Links</AppText>
            <AppText style={styles.sectionNote}>
              Empty fields are hidden on your public page
            </AppText>

            <View style={styles.card}>
              {SOCIAL_ROWS.map((item, index) => (
                <View
                  key={item.key}
                  style={
                    index === SOCIAL_ROWS.length - 1
                      ? styles.lastRow
                      : undefined
                  }
                >
                  <EditBusinessSocialRow
                    icon={item.icon}
                    label={item.label}
                    value={draft.socialLinks[item.key]}
                    onChangeText={onSocialField(item.key)}
                    placeholder={`Your ${item.label.toLowerCase()}`}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Business Hours — always visible */}
          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Business Hours</AppText>
            <View style={styles.card}>
              {draft.hours.map((entry) => (
                <EditBusinessHourRow
                  key={entry.day}
                  label={DAY_LABELS[entry.day]}
                  isOpen={entry.isOpen}
                  onToggle={(v) => onHourToggle(entry.day, v)}
                  openTime={entry.openTime}
                  closeTime={entry.closeTime}
                  onOpenTimeChange={(v) => onHourTime(entry.day, "openTime", v)}
                  onCloseTimeChange={(v) =>
                    onHourTime(entry.day, "closeTime", v)
                  }
                  onValidationChange={(isValid) => {
                    hoursValidity.current[entry.day] = isValid;
                  }}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        {showSuccess && (
          <View style={styles.bannerSuccess}>
            <AppText style={styles.bannerSuccessText}>
              Changes saved successfully
            </AppText>
          </View>
        )}
        {saveError != null && !showSuccess && (
          <View style={styles.bannerError}>
            <AppText style={styles.bannerErrorText}>{saveError}</AppText>
          </View>
        )}
        {showError && !showSuccess && (
          <AppText style={styles.validationError}>{errorMessage}</AppText>
        )}

        <AppButton
          title={isSaving ? "Saving..." : "Save changes"}
          onPress={handleSave}
          disabled={!canSave || isSaving}
        />
      </View>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardContent: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
      gap: spacing.xl,
    },

    // Avatar
    avatarSection: {
      alignItems: "center",
      paddingTop: spacing.sm,
    },
    avatarContainer: {
      width: 96,
      height: 96,
    },
    avatarEditBtn: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.accentOrange,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.background,
    },

    // Sections
    section: {
      gap: spacing.md,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    sectionNote: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: -spacing.xs,
    },

    // Fields
    fieldGroup: {
      gap: spacing.xs,
    },
    fieldLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    errorText: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.error,
      marginTop: 2,
    },

    // Read-only field (mimics disabled AppInput)
    readOnlyField: {
      height: 50,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    readOnlyValue: {
      flex: 1,
      fontSize: 15,
      color: colors.textMuted,
      marginRight: spacing.sm,
    },
    readOnlyCaption: {
      fontSize: 11,
      color: colors.textMuted,
    },

    // Address + postal row
    addressRow: {
      flexDirection: "row",
      gap: spacing.md,
      alignItems: "flex-start",
    },
    addressField: {
      flex: 2,
    },
    postalField: {
      flex: 1,
    },

    // City + state row
    halfRow: {
      flexDirection: "row",
      gap: spacing.md,
    },
    halfField: {
      flex: 1,
    },

    // Card
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
    },
    lastRow: {
      borderBottomWidth: 0,
    },

    // Footer
    footer: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      paddingBottom: spacing.xxl,
      gap: spacing.sm,
      backgroundColor: colors.background,
    },
    saveButton: {
      height: 50,
      backgroundColor: colors.primaryGreen,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.white,
    },
    bannerSuccess: {
      backgroundColor: colors.primaryGreenSoft,
      borderRadius: radius.sm,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      alignItems: "center",
    },
    bannerSuccessText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primaryGreen,
    },
    bannerError: {
      backgroundColor: colors.accentOrangeSoft,
      borderRadius: radius.sm,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      alignItems: "center",
    },
    bannerErrorText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.error,
    },
    validationError: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.error,
      textAlign: "center",
      marginBottom: spacing.sm,
    },
  });
}
