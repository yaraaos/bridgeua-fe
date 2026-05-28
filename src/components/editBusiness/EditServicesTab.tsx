import { getCategoryIcon } from "@/src/features/businesses/utils/categoryIcons";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppButton from "@/src/components/ui/AppButton/AppButton";

import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { useEditBusiness } from "@/src/features/businesses/hooks/useEditBusiness";
import type { BusinessDetails } from "@/src/features/businesses/types/business.types";
import type {
  ConfiguredService,
  ServiceLibraryItem,
} from "@/src/features/businesses/types/editBusiness.types";

import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useFormValidation } from "@/src/hooks/useFormValidation";
import { useEditBusinessStore } from "@/src/store/editBusiness.store";

import { getBusinessServiceLibrary } from "@/src/features/businesses/services/business.service";
import { apiClient } from "@/src/services/api/client";
import { useTeamStore } from "@/src/store/team.store";
import EditBusinessServiceCard from "./EditBusinessServiceCard";

type EditServicesTabProps = {
  business?: BusinessDetails | null;
  businessId?: string;
};

export default function EditServicesTab({
  business,
  businessId,
}: EditServicesTabProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const [libraryItems, setLibraryItems] = useState<ServiceLibraryItem[]>([]);
  const [isLibraryLoading, setIsLibraryLoading] = useState(false);
  const hydratedBusinessIdRef = useRef<string | null>(null);

  const services = useEditBusinessStore((s) => s.servicesDraft.services);
  const isDirty = useEditBusinessStore((s) => s.dirty.services);
  const markDirty = useEditBusinessStore((s) => s.markDirty);
  const addConfiguredServices = useEditBusinessStore(
    (s) => s.addConfiguredServices,
  );
  const updateConfiguredService = useEditBusinessStore(
    (s) => s.updateConfiguredService,
  );
  const removeConfiguredService = useEditBusinessStore(
    (s) => s.removeConfiguredService,
  );

  const { saveServices, isSavingServices, hasServicesError, saveError } =
    useEditBusiness(businessId);

  const { members, updateMember } = useTeamStore();

  const scrollRef = useRef<ScrollView>(null);
  const cardPositions = useRef<Record<string, number>>({});

  const { showError, errorMessage, triggerError, clearError } =
    useFormValidation();

  const [libraryOpen, setLibraryOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showValidation, setShowValidation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const configuredIds = new Set(services.map((s) => s.id));
  const availableLibraryItems = libraryItems.filter(
    (item) => !configuredIds.has(item.serviceId),
  );

  const allValid = services.every(
    (s) => s.duration.trim() !== "" && s.price.trim() !== "",
  );
  const canSave = isDirty && allValid;

  useEffect(() => {
    let isMounted = true;

    const loadLibrary = async () => {
      try {
        setIsLibraryLoading(true);
        const items = await getBusinessServiceLibrary();

        if (isMounted) {
          setLibraryItems(items);
        }
      } finally {
        if (isMounted) {
          setIsLibraryLoading(false);
        }
      }
    };

    void loadLibrary();

    return () => {
      isMounted = false;
    };
  }, []);

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

  useEffect(() => {
    if (!business) return;

    const nextBusinessId = String(business.id ?? businessId ?? "");

    if (
      nextBusinessId !== "" &&
      hydratedBusinessIdRef.current === nextBusinessId
    ) {
      return;
    }

    useEditBusinessStore.getState().setServicesDraft({
      services: (business.services ?? []).map((service) => ({
        id: service.serviceId ?? service.id,
        name: service.name,
        duration:
          service.durationMinutes != null
            ? String(service.durationMinutes)
            : "",
        price: service.price != null ? String(service.price) : "",
      })),
    });

    hydratedBusinessIdRef.current = nextBusinessId;
  }, [business, businessId]);

  function handleAddSelected() {
    const newServices: ConfiguredService[] = libraryItems
      .filter((item) => selectedIds.has(item.serviceId))
      .map((item) => ({
        id: item.serviceId,
        name: item.name,
        duration: "",
        price: "",
      }));
    addConfiguredServices(newServices);
    markDirty("services");
    setSelectedIds(new Set());
    setLibraryOpen(false);
  }

  async function handleSave() {
    if (!isDirty) return;
    if (!allValid) {
      setShowValidation(true);
      triggerError("Fill in the required fields");
      const firstInvalidId = services.find(
        (s) => s.duration.trim() === "" || s.price.trim() === "",
      )?.id;
      if (firstInvalidId !== undefined) {
        scrollRef.current?.scrollTo({
          y: (cardPositions.current[firstInvalidId] ?? 0) - spacing.lg,
          animated: true,
        });
      }
      return;
    }
    const result = await saveServices();
    if (result.ok) {
      setShowValidation(false);
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
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets
        >
          {/* Configured services list */}
          {services.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name={getCategoryIcon(
                  business?.category?.toLowerCase().replace(/\s+/g, "-"),
                )}
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
                <View
                  key={svc.id}
                  onLayout={(e) => {
                    cardPositions.current[svc.id] = e.nativeEvent.layout.y;
                  }}
                >
                  <EditBusinessServiceCard
                    service={svc}
                    showValidation={showValidation}
                    dbServiceId={svc.id}
                    onRemove={() => {
                      removeConfiguredService(svc.id);
                      markDirty("services");
                    }}
                    onDurationChange={(v) => {
                      updateConfiguredService(svc.id, { duration: v });
                      markDirty("services");
                      clearError();
                    }}
                    onPriceChange={(v) => {
                      updateConfiguredService(svc.id, { price: v });
                      markDirty("services");
                      clearError();
                    }}
                    members={members}
                    onToggleMember={(memberId) => {
                      try {
                        const member = members.find(
                          (m) => String(m.id) === String(memberId),
                        );
                        if (!member) return;
                        const realServiceId = svc.id;
                        const currentIds = member.serviceIds?.map(String) ?? [];
                        const updatedServiceIds = currentIds.includes(
                          realServiceId,
                        )
                          ? currentIds.filter((id) => id !== realServiceId)
                          : [...currentIds, realServiceId];
                        updateMember(memberId, {
                          serviceIds: updatedServiceIds,
                        });
                        markDirty("services");
                        if (businessId) {
                          void apiClient
                            .patch(
                              `/api/businesses/${businessId}/team/${String(memberId)}`,
                              { serviceIds: updatedServiceIds },
                            )
                            .catch(() => {});
                        }
                      } catch {
                        // silent
                      }
                    }}
                  />
                </View>
              ))}
            </View>
          )}

          {/* Browse service library toggle */}
          <Pressable
            style={styles.libraryToggle}
            onPress={() => setLibraryOpen((v) => !v)}
          >
            <Ionicons
              name="grid-outline"
              size={16}
              color={colors.primaryGreen}
            />
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
              {isLibraryLoading ? (
                <AppText style={styles.libraryAllAdded}>
                  Loading services...
                </AppText>
              ) : availableLibraryItems.length === 0 ? (
                <AppText style={styles.libraryAllAdded}>
                  All available services have been added
                </AppText>
              ) : (
                availableLibraryItems.map((item) => {
                  const isSelected = selectedIds.has(item.serviceId);
                  return (
                    <Pressable
                      key={item.serviceId}
                      style={[
                        styles.libraryItem,
                        isSelected && styles.libraryItemSelected,
                      ]}
                      onPress={() => toggleLibraryItem(item.serviceId)}
                    >
                      <AppText style={styles.libraryItemName}>
                        {item.name}
                      </AppText>
                      <Ionicons
                        name={
                          isSelected ? "checkmark-circle" : "add-circle-outline"
                        }
                        size={22}
                        color={
                          isSelected ? colors.primaryGreen : colors.textMuted
                        }
                      />
                    </Pressable>
                  );
                })
              )}
            </View>
          )}

          {/* Can't find a service footer */}
          <View style={styles.contactFooter}>
            <Text style={styles.contactText}>
              Can&apos;t find a service you need?{" "}
              <Text
                style={styles.contactLink}
                onPress={() => Linking.openURL("mailto:support@bridgeua.com")}
              >
                Contact us
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Floating "Add selected" button — shown above save bar */}
      {selectedIds.size > 0 && (
        <View style={styles.floatingBar}>
          <Pressable style={styles.floatingButton} onPress={handleAddSelected}>
            <AppText style={styles.floatingButtonText}>
              Add {selectedIds.size} service
              {selectedIds.size > 1 ? "s" : ""}
            </AppText>
          </Pressable>
        </View>
      )}

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
        {showError && !showSuccess && (
          <AppText style={styles.validationError}>{errorMessage}</AppText>
        )}

        <AppButton
          title={isSavingServices ? "Saving..." : "Save changes"}
          onPress={handleSave}
          disabled={!canSave || isSavingServices}
          disabledPressable={isDirty && !isSavingServices}
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
    contactFooter: {
      paddingVertical: spacing.lg,
      alignItems: "center",
    },
    contactText: {
      fontSize: 13,
      color: colors.textMuted,
      textAlign: "center",
    },
    contactLink: {
      color: colors.primaryGreen,
      fontWeight: "700",
    },
    floatingBar: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      backgroundColor: colors.background,
    },
    floatingButton: {
      height: 48,
      backgroundColor: colors.primaryGreen,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    floatingButtonText: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.white,
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
  });
}
