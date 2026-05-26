import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

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

export default function EditOverviewTab() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const draft = useEditBusinessStore((s) => s.overviewDraft);
  const isDirty = useEditBusinessStore((s) => s.dirty.overview);
  const markDirty = useEditBusinessStore((s) => s.markDirty);
  const setOverviewDraft = useEditBusinessStore((s) => s.setOverviewDraft);
  const updateOverviewHour = useEditBusinessStore((s) => s.updateOverviewHour);

  const { saveOverview, isSaving, saveError } = useEditBusiness();
  const [hoursExpanded, setHoursExpanded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onField(
    key: "name" | "category" | "address" | "city" | "state" | "phone"
  ) {
    return (value: string) => {
      setOverviewDraft({ [key]: value });
      markDirty("overview");
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
    value: string
  ) {
    updateOverviewHour(day, { [field]: value });
    markDirty("overview");
  }

  async function handleSave() {
    const result = await saveOverview();
    if (result.ok) {
      if (successTimer.current) clearTimeout(successTimer.current);
      setShowSuccess(true);
      successTimer.current = setTimeout(() => setShowSuccess(false), 3000);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {/* Business Information */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Business Information</AppText>

          <View style={styles.fieldGroup}>
            <AppText style={styles.fieldLabel}>Business Name</AppText>
            <AppInput
              value={draft.name}
              onChangeText={onField("name")}
              placeholder="e.g. Zelenska Beauty"
            />
          </View>

          <View style={styles.fieldGroup}>
            <AppText style={styles.fieldLabel}>Category</AppText>
            <AppInput
              value={draft.category}
              onChangeText={onField("category")}
              placeholder="e.g. Beauty & Wellness"
            />
          </View>

          <View style={styles.fieldGroup}>
            <AppText style={styles.fieldLabel}>Address</AppText>
            <AppInput
              value={draft.address}
              onChangeText={onField("address")}
              placeholder="Street address"
            />
          </View>

          <View style={styles.halfRow}>
            <View style={styles.halfField}>
              <AppText style={styles.fieldLabel}>City</AppText>
              <AppInput
                value={draft.city}
                onChangeText={onField("city")}
                placeholder="City"
              />
            </View>
            <View style={styles.halfField}>
              <AppText style={styles.fieldLabel}>State / Region</AppText>
              <AppInput
                value={draft.state}
                onChangeText={onField("state")}
                placeholder="State"
              />
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
                style={index === SOCIAL_ROWS.length - 1 && styles.lastRow}
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

        {/* Business Hours */}
        <View style={styles.section}>
          <Pressable
            style={styles.sectionHeaderRow}
            onPress={() => setHoursExpanded((v) => !v)}
          >
            <AppText style={styles.sectionTitle}>Business Hours</AppText>
            <Ionicons
              name={hoursExpanded ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.textSecondary}
            />
          </Pressable>

          {hoursExpanded && (
            <View style={styles.card}>
              {draft.hours.map((entry) => (
                <EditBusinessHourRow
                  key={entry.day}
                  label={DAY_LABELS[entry.day]}
                  isOpen={entry.isOpen}
                  onToggle={(v) => onHourToggle(entry.day, v)}
                  openTime={entry.openTime}
                  closeTime={entry.closeTime}
                  onOpenTimeChange={(v) =>
                    onHourTime(entry.day, "openTime", v)
                  }
                  onCloseTimeChange={(v) =>
                    onHourTime(entry.day, "closeTime", v)
                  }
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

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

        <Pressable
          style={[
            styles.saveButton,
            (!isDirty || isSaving) && styles.saveButtonDisabled,
          ]}
          onPress={isDirty && !isSaving ? handleSave : undefined}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <AppText style={styles.saveButtonText}>Save changes</AppText>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
      gap: spacing.xl,
    },
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
    sectionHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    fieldGroup: {
      gap: spacing.xs,
    },
    fieldLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    halfRow: {
      flexDirection: "row",
      gap: spacing.md,
    },
    halfField: {
      flex: 1,
      gap: spacing.xs,
    },
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
    footer: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      paddingBottom: spacing.lg,
      gap: spacing.sm,
      backgroundColor: colors.background,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    saveButton: {
      height: 50,
      backgroundColor: colors.primaryGreen,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    saveButtonDisabled: {
      backgroundColor: colors.textMuted,
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
  });
}
