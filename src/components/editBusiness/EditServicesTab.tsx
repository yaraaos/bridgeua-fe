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

import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { BEAUTY_SERVICES } from "@/src/features/businesses/data/beautyServices";
import { useEditBusiness } from "@/src/features/businesses/hooks/useEditBusiness";
import type { ConfiguredService } from "@/src/features/businesses/types/editBusiness.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useEditBusinessStore } from "@/src/store/editBusiness.store";

import EditBusinessServiceCard from "./EditBusinessServiceCard";

export default function EditServicesTab() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const services = useEditBusinessStore((s) => s.servicesDraft.services);
  const isDirty = useEditBusinessStore((s) => s.dirty.services);
  const markDirty = useEditBusinessStore((s) => s.markDirty);
  const addConfiguredServices = useEditBusinessStore(
    (s) => s.addConfiguredServices
  );
  const updateConfiguredService = useEditBusinessStore(
    (s) => s.updateConfiguredService
  );
  const removeConfiguredService = useEditBusinessStore(
    (s) => s.removeConfiguredService
  );

  const { saveServices, isSavingServices, hasServicesError, saveError } =
    useEditBusiness();

  const [libraryOpen, setLibraryOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showValidation, setShowValidation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const configuredIds = new Set(services.map((s) => s.id));
  const availableLibraryItems = BEAUTY_SERVICES.filter(
    (item) => !configuredIds.has(item.id)
  );

  const allValid = services.every(
    (s) => s.duration.trim() !== "" && s.price.trim() !== ""
  );
  const canSave = isDirty && allValid;

  function toggleLibraryItem(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleAddSelected() {
    const newServices: ConfiguredService[] = BEAUTY_SERVICES.filter((item) =>
      selectedIds.has(item.id)
    ).map((item) => ({ id: item.id, name: item.name, duration: "", price: "" }));
    addConfiguredServices(newServices);
    markDirty("services");
    setSelectedIds(new Set());
    setLibraryOpen(false);
  }

  async function handleSave() {
    if (!isDirty) return;
    if (!allValid) {
      setShowValidation(true);
      return;
    }
    const result = await saveServices();
    if (result.ok) {
      setShowValidation(false);
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
        {/* Configured services list */}
        {services.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="cut-outline"
              size={40}
              color={colors.textMuted}
            />
            <AppText style={styles.emptyTitle}>No services yet</AppText>
            <AppText style={styles.emptySubtitle}>
              Browse the library below to add services
            </AppText>
          </View>
        ) : (
          <View style={styles.servicesList}>
            {services.map((svc) => (
              <EditBusinessServiceCard
                key={svc.id}
                service={svc}
                showValidation={showValidation}
                onRemove={() => {
                  removeConfiguredService(svc.id);
                  markDirty("services");
                }}
                onDurationChange={(v) => {
                  updateConfiguredService(svc.id, { duration: v });
                  markDirty("services");
                }}
                onPriceChange={(v) => {
                  updateConfiguredService(svc.id, { price: v });
                  markDirty("services");
                }}
              />
            ))}
          </View>
        )}

        {/* Browse service library toggle */}
        <Pressable
          style={styles.libraryToggle}
          onPress={() => setLibraryOpen((v) => !v)}
        >
          <Ionicons name="grid-outline" size={16} color={colors.primaryGreen} />
          <AppText style={styles.libraryToggleText}>
            Browse service library
          </AppText>
          <Ionicons
            name={libraryOpen ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.primaryGreen}
          />
        </Pressable>

        {/* Library section */}
        {libraryOpen && (
          <View style={styles.librarySection}>
            {availableLibraryItems.length === 0 ? (
              <AppText style={styles.libraryAllAdded}>
                All available services have been added
              </AppText>
            ) : (
              availableLibraryItems.map((item) => {
                const isSelected = selectedIds.has(item.id);
                return (
                  <Pressable
                    key={item.id}
                    style={[
                      styles.libraryItem,
                      isSelected && styles.libraryItemSelected,
                    ]}
                    onPress={() => toggleLibraryItem(item.id)}
                  >
                    <AppText style={styles.libraryItemName}>{item.name}</AppText>
                    <Ionicons
                      name={
                        isSelected ? "checkmark-circle" : "add-circle-outline"
                      }
                      size={22}
                      color={isSelected ? colors.primaryGreen : colors.textMuted}
                    />
                  </Pressable>
                );
              })
            )}

            {selectedIds.size > 0 && (
              <Pressable style={styles.addCta} onPress={handleAddSelected}>
                <AppText style={styles.addCtaText}>
                  Add {selectedIds.size} service
                  {selectedIds.size > 1 ? "s" : ""}
                </AppText>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {showSuccess && (
          <View style={styles.bannerSuccess}>
            <AppText style={styles.bannerSuccessText}>
              Services saved successfully
            </AppText>
          </View>
        )}
        {(hasServicesError || saveError != null) && !showSuccess && (
          <View style={styles.bannerError}>
            <AppText style={styles.bannerErrorText}>
              {saveError ?? "Failed to save changes"}
            </AppText>
          </View>
        )}

        <Pressable
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          onPress={!isSavingServices ? handleSave : undefined}
        >
          {isSavingServices ? (
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
      gap: spacing.md,
    },
    servicesList: {
      gap: spacing.md,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.xxl,
      gap: spacing.sm,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textSecondary,
    },
    emptySubtitle: {
      fontSize: 13,
      color: colors.textMuted,
      textAlign: "center",
    },
    libraryToggle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderStyle: "dashed",
      borderColor: colors.primaryGreen,
    },
    libraryToggleText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.primaryGreen,
    },
    librarySection: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    libraryItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.md,
      paddingVertical: 13,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    libraryItemSelected: {
      backgroundColor: colors.primaryGreenSoft,
    },
    libraryItemName: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    libraryAllAdded: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: "center",
      paddingVertical: spacing.xl,
    },
    addCta: {
      backgroundColor: colors.primaryGreen,
      paddingVertical: spacing.md,
      alignItems: "center",
    },
    addCtaText: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.white,
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
