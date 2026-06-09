import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import AppAvatar from "@/src/components/ui/AppAvatar/AppAvatar";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppText from "@/src/components/ui/AppText/AppText";
import ClearableInput from "@/src/components/ui/ClearableInput";
import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { useEditBusiness } from "@/src/features/businesses/hooks/useEditBusiness";
import type {
  DayOfWeek,
  EditBusinessOverviewDraft,
  EditBusinessSocialLinks,
} from "@/src/features/businesses/types/editBusiness.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useFormValidation } from "@/src/hooks/useFormValidation";
import { useScrollToError } from "@/src/hooks/useScrollToError";
import { useActiveAccount } from "@/src/store/account.store";
import { useEditBusinessStore } from "@/src/store/editBusiness.store";

import { US_STATE_BOUNDS } from "@/src/constants/stateBounds";
import { BusinessDetails } from "@/src/features/businesses/types/business.types";
import EditBusinessHourRow from "./EditBusinessHourRow";
import EditBusinessSocialRow from "./EditBusinessSocialRow";

const US_STATES = Object.keys(US_STATE_BOUNDS);

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

type EditOverviewTabProps = {
  business?: BusinessDetails | null;
  businessId?: string;
};

const API_DAY_TO_DRAFT_DAY: Record<number, DayOfWeek> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

function mapBusinessHoursToDraftHours(
  businessHours: BusinessDetails["businessHours"],
  fallbackHours: EditBusinessOverviewDraft["hours"],
): EditBusinessOverviewDraft["hours"] {
  if (!businessHours || businessHours.length === 0) {
    return fallbackHours;
  }

  return fallbackHours.map((fallbackHour) => {
    const apiHour = businessHours.find(
      (hour) => API_DAY_TO_DRAFT_DAY[hour.day] === fallbackHour.day,
    );

    if (!apiHour) {
      return fallbackHour;
    }

    return {
      day: fallbackHour.day,
      isOpen: !apiHour.isClosed,
      openTime: apiHour.opensAt ?? fallbackHour.openTime,
      closeTime: apiHour.closesAt ?? fallbackHour.closeTime,
    };
  });
}

export default function EditOverviewTab({
  business,
  businessId,
}: EditOverviewTabProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const account = useActiveAccount();

  const draft = useEditBusinessStore((s) => s.overviewDraft);
  const isDirty = useEditBusinessStore((s) => s.dirty.overview);
  const markDirty = useEditBusinessStore((s) => s.markDirty);
  const setOverviewDraft = useEditBusinessStore((s) => s.setOverviewDraft);
  const updateOverviewHour = useEditBusinessStore((s) => s.updateOverviewHour);
  const hydratedBusinessIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!business) {
      return;
    }

    const nextBusinessId = String(business.id ?? businessId ?? "");

    if (
      nextBusinessId !== "" &&
      hydratedBusinessIdRef.current === nextBusinessId
    ) {
      return;
    }

    const currentDraft = useEditBusinessStore.getState().overviewDraft;

    setOverviewDraft({
      name: business.name ?? "",
      category: business.category ?? "",
      avatarUrl: business.avatarUrl ?? currentDraft.avatarUrl,
      address: business.address ?? "",
      postalCode: business.zipCode ?? "",
      city: business.city ?? "",
      state: business.state ?? "",
      phone: business.phone ?? "",
      latitude: business.latitude != null ? String(business.latitude) : "",
      longitude: business.longitude != null ? String(business.longitude) : "",

      socialLinks: {
        ...currentDraft.socialLinks,
        website: business.socialLinks?.website ?? business.website ?? "",
        instagram: business.socialLinks?.instagram ?? "",
        facebook: business.socialLinks?.facebook ?? "",
        telegram: business.socialLinks?.telegram ?? "",
        whatsapp: business.socialLinks?.whatsapp ?? "",
      },

      hours: mapBusinessHoursToDraftHours(
        business.businessHours,
        currentDraft.hours,
      ),
    });

    hydratedBusinessIdRef.current = nextBusinessId;
  }, [business, businessId, setOverviewDraft]);

  const [stateQuery, setStateQuery] = useState(draft.state ?? "");
  const [scrollOffset, setScrollOffset] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    setStateQuery(draft.state ?? "");
  }, [draft.state]);

  const stateSuggestions =
    stateQuery.trim().length >= 1 && !US_STATES.includes(stateQuery.trim())
      ? US_STATES.filter((s) =>
          s.toLowerCase().startsWith(stateQuery.trim().toLowerCase()),
        )
      : [];

  const { scrollRef, registerField, scrollToFirstError } = useScrollToError();
  const hoursValidity = useRef<Record<string, boolean>>(
    Object.fromEntries(
      draft.hours.map((h) => [
        h.day,
        !h.isOpen || (h.openTime !== "" && h.closeTime !== ""),
      ]),
    ),
  );

  const { saveOverview, isSaving, saveError } = useEditBusiness(businessId);
  const { showError, errorMessage, triggerError, clearError } =
    useFormValidation();
  const [errors, setErrors] = useState<OverviewErrors>(NO_ERRORS);
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const displayedAvatarUrl =
    draft.avatarUrl || business?.avatarUrl || account?.avatarUrl;

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

  const onStateChange = onField("state");

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
      scrollToFirstError(["address", "postalCode", "city", "state"], newErrors);
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
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <AppAvatar
                imageUrl={displayedAvatarUrl}
                name={business?.name || "Loading..."}
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

          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Business Information</AppText>

            <View style={styles.fieldGroup}>
              <AppText style={styles.fieldLabel}>Business Name</AppText>
              <View style={styles.readOnlyField}>
                <AppText style={styles.readOnlyValue} numberOfLines={1}>
                  {business?.name || "Loading..."}{" "}
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
                {...registerField("address")}
              >
                <AppText style={styles.fieldLabel}>Address</AppText>
                <ClearableInput
                  value={draft.address}
                  onChangeText={onField("address")}
                  onClear={() => onField("address")("")}
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
                {...registerField("postalCode")}
              >
                <AppText style={styles.fieldLabel}>Postal Code</AppText>
                <ClearableInput
                  value={draft.postalCode}
                  onChangeText={onField("postalCode")}
                  onClear={() => onField("postalCode")("")}
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
                {...registerField("city")}
              >
                <AppText style={styles.fieldLabel}>City</AppText>
                <ClearableInput
                  value={draft.city}
                  onChangeText={onField("city")}
                  onClear={() => onField("city")("")}
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
                style={[
                  styles.fieldGroup,
                  styles.halfField,
                  { position: "relative", zIndex: 100 },
                ]}
              >
                <AppText style={styles.fieldLabel}>State / Region</AppText>
                <ClearableInput
                  value={stateQuery}
                  onChangeText={(value) => {
                    const trimmed = value.replace(/\s+$/, "");
                    setStateQuery(trimmed);
                    onStateChange("");
                    setErrors((prev) => ({ ...prev, state: false }));
                    clearError();
                  }}
                  onClear={() => {
                    setStateQuery("");
                    onStateChange("");
                    setErrors((prev) => ({ ...prev, state: false }));
                    clearError();
                  }}
                  placeholder="State"
                  error={errors.state}
                />
                {stateSuggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    <ScrollView
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                      style={{ maxHeight: 180 }}
                      onScroll={(e) =>
                        setScrollOffset(e.nativeEvent.contentOffset.y)
                      }
                      onLayout={(e) =>
                        setScrollViewHeight(e.nativeEvent.layout.height)
                      }
                      onContentSizeChange={(_, h) => setContentHeight(h)}
                      scrollEventThrottle={16}
                    >
                      {stateSuggestions.map((suggestion) => (
                        <Pressable
                          key={suggestion}
                          style={styles.suggestionItem}
                          onPress={() => {
                            setStateQuery(suggestion);
                            onStateChange(suggestion);
                            setErrors((prev) => ({ ...prev, state: false }));
                            clearError();
                          }}
                        >
                          <AppText style={styles.suggestionText}>
                            {suggestion}
                          </AppText>
                        </Pressable>
                      ))}
                    </ScrollView>
                    {contentHeight > scrollViewHeight &&
                      (() => {
                        const trackHeight = scrollViewHeight - 12;
                        const thumbHeight = Math.max(
                          20,
                          (scrollViewHeight / contentHeight) * trackHeight,
                        );
                        const maxThumbTop = trackHeight - thumbHeight;
                        const thumbTop = Math.min(
                          maxThumbTop,
                          Math.max(
                            0,
                            (scrollOffset /
                              (contentHeight - scrollViewHeight)) *
                              maxThumbTop,
                          ),
                        );
                        return (
                          <View style={styles.scrollTrack}>
                            <View
                              style={[
                                styles.scrollThumb,
                                { height: thumbHeight, top: thumbTop },
                              ]}
                            />
                          </View>
                        );
                      })()}
                  </View>
                )}
                {errors.state && (
                  <AppText style={styles.errorText}>
                    This field is required
                  </AppText>
                )}
              </View>
            </View>

            <View style={styles.halfRow}>
              <View style={[styles.fieldGroup, styles.halfField]}>
                <AppText style={styles.fieldLabel}>Latitude</AppText>
                <ClearableInput
                  value={draft.latitude ?? ""}
                  onChangeText={onField("latitude")}
                  onClear={() => onField("latitude")("")}
                  placeholder="e.g. 34.0549"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={[styles.fieldGroup, styles.halfField]}>
                <AppText style={styles.fieldLabel}>Longitude</AppText>
                <ClearableInput
                  value={draft.longitude ?? ""}
                  onChangeText={onField("longitude")}
                  onClear={() => onField("longitude")("")}
                  placeholder="e.g. -118.2426"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <AppText style={styles.fieldLabel}>Phone Number</AppText>
              <ClearableInput
                value={draft.phone}
                onChangeText={onField("phone")}
                onClear={() => onField("phone")("")}
                placeholder="+1 (555) 000-0000"
                keyboardType="phone-pad"
              />
            </View>
          </View>

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
          disabledPressable={isDirty && !isSaving}
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
    halfRow: {
      flexDirection: "row",
      gap: spacing.md,
    },
    halfField: {
      flex: 1,
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
    suggestionsContainer: {
      position: "absolute",
      top: 72,
      left: 0,
      right: 0,
      backgroundColor: colors.primaryGreenDark,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primaryGreen,
      zIndex: 999,
      elevation: 10,
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
    suggestionItem: {
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.08)",
    },
    suggestionText: {
      fontSize: 14,
      color: colors.white,
    },
    scrollTrack: {
      position: "absolute",
      right: 4,
      top: 6,
      bottom: 6,
      width: 3,
      borderRadius: 2,
      backgroundColor: "rgba(255,255,255,0.15)",
    },
    scrollThumb: {
      position: "absolute",
      width: 3,
      borderRadius: 2,
      backgroundColor: "rgba(255,255,255,0.5)",
    },
  });
}
