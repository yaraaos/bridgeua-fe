import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import AppButton from "@/src/components/ui/AppButton/AppButton";

import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { useEditBusiness } from "@/src/features/businesses/hooks/useEditBusiness";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useEditBusinessStore } from "@/src/store/editBusiness.store";

import { BusinessDetails } from "@/src/features/businesses/types/business.types";
import SelectableChip from "./SelectableChip";

const DESCRIPTION_LIMIT = 1000;

const LANGUAGES = [
  "English",
  "Ukrainian",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Polish",
  "Arabic",
  "Chinese",
  "Japanese",
  "Korean",
  "Hindi",
  "Turkish",
  "Dutch",
  "Russian",
];

const AMENITIES: {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: "wifi", label: "Wi-Fi", icon: "wifi-outline" },
  { id: "parking", label: "Parking", icon: "car-outline" },
  { id: "ac", label: "Air Conditioning", icon: "snow-outline" },
  { id: "pet", label: "Pet Friendly", icon: "paw-outline" },
  {
    id: "accessibility",
    label: "Wheelchair Accessible",
    icon: "accessibility-outline",
  },
  { id: "coffee", label: "Coffee & Drinks", icon: "cafe-outline" },
  { id: "tv", label: "TV", icon: "tv-outline" },
  { id: "outdoor", label: "Outdoor Seating", icon: "umbrella-outline" },
];

type EditAboutTabProps = {
  business?: BusinessDetails | null;
};

export default function EditAboutTab({ business }: EditAboutTabProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const aboutDraft = useEditBusinessStore((s) => s.aboutDraft);
  const isDirty = useEditBusinessStore((s) => s.dirty.about);
  const markDirty = useEditBusinessStore((s) => s.markDirty);
  const setAboutDraft = useEditBusinessStore((s) => s.setAboutDraft);
  const hydratedBusinessIdRef = useRef<string | null>(null);

  const { saveAbout, isSavingAbout, hasAboutError, saveError } =
    useEditBusiness();

  useEffect(() => {
    if (!business) return;

    const nextBusinessId = String(business.id ?? "");

    if (
      nextBusinessId !== "" &&
      hydratedBusinessIdRef.current === nextBusinessId
    ) {
      return;
    }

    setAboutDraft({
      description: business.about.description ?? "",
      languages: business.about.languages ?? [],
      amenities: (business.about.amenities ?? []).map((amenity) => amenity.id),
    });

    hydratedBusinessIdRef.current = nextBusinessId;
  }, [business, setAboutDraft]);

  const scrollRef = useRef<ScrollView>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleDescriptionChange(text: string) {
    if (text.length > DESCRIPTION_LIMIT) return;
    setAboutDraft({ description: text });
    markDirty("about");
  }

  function toggleLanguage(lang: string) {
    const next = aboutDraft.languages.includes(lang)
      ? aboutDraft.languages.filter((l) => l !== lang)
      : [...aboutDraft.languages, lang];
    setAboutDraft({ languages: next });
    markDirty("about");
  }

  function toggleAmenity(id: string) {
    const next = aboutDraft.amenities.includes(id)
      ? aboutDraft.amenities.filter((a) => a !== id)
      : [...aboutDraft.amenities, id];
    setAboutDraft({ amenities: next });
    markDirty("about");
  }

  async function handleSave() {
    if (!isDirty) return;
    const result = await saveAbout();
    if (result.ok) {
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
        keyboardVerticalOffset={Platform.OS === "ios" ? 160 : 0}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets
        >
          {/* Description */}
          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Description</AppText>
            <View style={styles.textareaWrapper}>
              <TextInput
                style={[styles.textarea, { color: colors.textPrimary }]}
                value={aboutDraft.description}
                onChangeText={handleDescriptionChange}
                placeholder="Tell customers about your business…"
                placeholderTextColor={colors.textMuted}
                multiline
                textAlignVertical="top"
                maxLength={DESCRIPTION_LIMIT}
              />
              <AppText style={styles.charCounter}>
                {aboutDraft.description.length}/{DESCRIPTION_LIMIT}
              </AppText>
            </View>
          </View>

          {/* Languages */}
          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Languages</AppText>
            {aboutDraft.languages.length === 0 && (
              <AppText style={styles.emptyHint}>No languages selected</AppText>
            )}
            <View style={styles.chipRow}>
              {LANGUAGES.map((lang) => (
                <SelectableChip
                  key={lang}
                  label={lang}
                  selected={aboutDraft.languages.includes(lang)}
                  onPress={() => toggleLanguage(lang)}
                />
              ))}
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Amenities</AppText>
            <View style={styles.chipRow}>
              {AMENITIES.map((amenity) => (
                <SelectableChip
                  key={amenity.id}
                  label={amenity.label}
                  icon={amenity.icon}
                  selected={aboutDraft.amenities.includes(amenity.id)}
                  onPress={() => toggleAmenity(amenity.id)}
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
              About saved successfully
            </AppText>
          </View>
        )}
        {(hasAboutError || saveError != null) && !showSuccess && (
          <View style={styles.bannerError}>
            <AppText style={styles.bannerErrorText}>
              {saveError ?? "Failed to save changes"}
            </AppText>
          </View>
        )}

        <AppButton
          title={isSavingAbout ? "Saving..." : "Save changes"}
          onPress={handleSave}
          disabled={!isDirty || isSavingAbout}
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
    section: {
      gap: spacing.md,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    textareaWrapper: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      gap: spacing.sm,
    },
    textarea: {
      fontSize: 15,
      lineHeight: 22,
      minHeight: 120,
    },
    charCounter: {
      fontSize: 12,
      color: colors.textMuted,
      textAlign: "right",
    },
    emptyHint: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: -spacing.xs,
    },
    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
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
  });
}
