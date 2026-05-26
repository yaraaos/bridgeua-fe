import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import AppButton from "@/src/components/ui/AppButton/AppButton";

import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { useEditBusiness } from "@/src/features/businesses/hooks/useEditBusiness";
import type { GalleryPhoto } from "@/src/features/businesses/types/editBusiness.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useEditBusinessStore } from "@/src/store/editBusiness.store";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PADDING = spacing.lg;
const GAP = spacing.cardGap;
const NUM_COLS = 3;
const CELL_SIZE =
  (SCREEN_WIDTH - 2 * PADDING - (NUM_COLS - 1) * GAP) / NUM_COLS;

export default function EditGalleryTab() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const galleryDraft = useEditBusinessStore((s) => s.galleryDraft);
  const isDirty = useEditBusinessStore((s) => s.dirty.gallery);
  const markDirty = useEditBusinessStore((s) => s.markDirty);
  const setGalleryDraft = useEditBusinessStore((s) => s.setGalleryDraft);

  const { saveGallery, isSavingGallery, hasGalleryError, saveError } =
    useEditBusiness();

  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [actionSheetPhoto, setActionSheetPhoto] = useState<GalleryPhoto | null>(
    null,
  );
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { photos, defaultPhotoIds } = galleryDraft;

  async function pickImages() {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (result.canceled) return;

    const newPhotos: GalleryPhoto[] = result.assets.map((asset) => ({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      url: asset.uri,
      isLocal: true,
    }));

    setGalleryDraft({ photos: [...photos, ...newPhotos] });
    markDirty("gallery");
  }

  function handleImageLoadStart(id: string) {
    setLoadingIds((prev) => new Set(prev).add(id));
  }

  function handleImageLoadEnd(id: string) {
    setLoadingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function handleSetDefault() {
    if (!actionSheetPhoto || defaultPhotoIds.length >= 3) return;

    setGalleryDraft({
      defaultPhotoIds: [...defaultPhotoIds, actionSheetPhoto.id],
    });

    markDirty("gallery");
    setActionSheetPhoto(null);
  }

  function handleRemoveDefault() {
    if (!actionSheetPhoto) return;

    setGalleryDraft({
      defaultPhotoIds: defaultPhotoIds.filter(
        (id) => id !== actionSheetPhoto.id,
      ),
    });

    markDirty("gallery");
    setActionSheetPhoto(null);
  }

  function handleDeleteRequest() {
    const photoToDelete = actionSheetPhoto;
    setActionSheetPhoto(null);
    if (!photoToDelete) return;
    Alert.alert("Delete Photo", "This photo will be permanently removed.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const { galleryDraft: current } = useEditBusinessStore.getState();
          setGalleryDraft({
            photos: current.photos.filter((p) => p.id !== photoToDelete.id),
            defaultPhotoIds: current.defaultPhotoIds.filter(
              (id) => id !== photoToDelete.id,
            ),
          });
          markDirty("gallery");
        },
      },
    ]);
  }

  async function handleSave() {
    if (!isDirty) return;
    const result = await saveGallery();
    if (result.ok) {
      if (successTimer.current) clearTimeout(successTimer.current);
      setShowSuccess(true);
      successTimer.current = setTimeout(() => setShowSuccess(false), 3000);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          <Pressable
            style={[styles.cell, styles.uploadCell]}
            onPress={pickImages}
          >
            <Ionicons name="add-outline" size={32} color={colors.textMuted} />
          </Pressable>

          {photos.map((photo) => {
            const isDefault = defaultPhotoIds.includes(photo.id);
            const isLoading = loadingIds.has(photo.id);
            const isMenuOpen = actionSheetPhoto?.id === photo.id;
            const setDefaultDisabled =
              !isDefault && defaultPhotoIds.length >= 3;
            const canSetDefault = !isDefault && defaultPhotoIds.length < 3;

            return (
              <View
                key={photo.id}
                style={[
                  styles.cell,
                  styles.photoCell,
                  isDefault && styles.photoCellDefault,
                ]}
              >
                <View style={styles.photoClip}>
                  {isLoading && (
                    <View
                      style={[StyleSheet.absoluteFill, styles.imagePlaceholder]}
                    />
                  )}

                  <Image
                    source={{ uri: photo.url }}
                    style={styles.photo}
                    onLoadStart={() => handleImageLoadStart(photo.id)}
                    onLoadEnd={() => handleImageLoadEnd(photo.id)}
                  />

                  {isDefault && (
                    <View style={styles.defaultBadge}>
                      <Ionicons
                        name="star-outline"
                        size={10}
                        color={colors.white}
                      />
                      <AppText style={styles.defaultBadgeText}>Default</AppText>
                    </View>
                  )}
                </View>

                <View style={styles.photoActionsWrap}>
                  <Pressable
                    style={[
                      styles.settingsButton,
                      isMenuOpen && styles.settingsButtonActive,
                    ]}
                    onPress={() =>
                      setActionSheetPhoto(isMenuOpen ? null : photo)
                    }
                    hitSlop={4}
                  >
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={16}
                      color={colors.primaryGreen}
                    />
                  </Pressable>

                  {isMenuOpen ? (
                    <View style={styles.photoActionsMenu}>
                      {isDefault ? (
                        <Pressable
                          style={styles.photoActionsMenuItem}
                          onPress={handleRemoveDefault}
                        >
                          <Ionicons
                            name="star-outline"
                            size={16}
                            color={colors.textSecondary}
                          />
                          <AppText style={styles.photoActionsMenuText}>
                            Remove default
                          </AppText>
                        </Pressable>
                      ) : (
                        <Pressable
                          style={[
                            styles.photoActionsMenuItem,
                            setDefaultDisabled &&
                              styles.photoActionsMenuItemDisabled,
                          ]}
                          onPress={canSetDefault ? handleSetDefault : undefined}
                        >
                          <Ionicons
                            name="star-outline"
                            size={16}
                            color={
                              canSetDefault
                                ? colors.accentOrange
                                : colors.textMuted
                            }
                          />
                          <AppText
                            style={[
                              styles.photoActionsMenuText,
                              !canSetDefault && { color: colors.textMuted },
                            ]}
                          >
                            Set default
                          </AppText>
                        </Pressable>
                      )}

                      <Pressable
                        style={styles.photoActionsMenuItem}
                        onPress={handleDeleteRequest}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color={colors.error}
                        />
                        <AppText
                          style={[
                            styles.photoActionsMenuText,
                            { color: colors.error },
                          ]}
                        >
                          Delete photo
                        </AppText>
                      </Pressable>
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>

        {photos.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons
              name="images-outline"
              size={48}
              color={colors.textMuted}
            />
            <AppText style={styles.emptyTitle}>No photos yet</AppText>
            <AppText style={styles.emptyCaption}>
              Add photos to showcase your business
            </AppText>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {showSuccess && (
          <View style={styles.bannerSuccess}>
            <AppText style={styles.bannerSuccessText}>
              Gallery saved successfully
            </AppText>
          </View>
        )}
        {(hasGalleryError || saveError != null) && !showSuccess && (
          <View style={styles.bannerError}>
            <AppText style={styles.bannerErrorText}>
              {saveError ?? "Failed to save changes"}
            </AppText>
          </View>
        )}
        <AppButton
          title={isSavingGallery ? "Saving..." : "Save changes"}
          onPress={handleSave}
          disabled={!isDirty || isSavingGallery}
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
    scrollContent: {
      padding: PADDING,
      paddingBottom: spacing.xl,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: GAP,
    },
    cell: {
      width: CELL_SIZE,
      height: CELL_SIZE,
      borderRadius: radius.md,
    },
    uploadCell: {
      borderWidth: 1.5,
      borderStyle: "dashed",
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    photoCell: {
      position: "relative",
    },
    photoCellDefault: {
      borderWidth: 2,
      borderColor: colors.accentOrange,
    },
    photoClip: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: radius.md,
      overflow: "hidden",
    },
    photo: {
      width: "100%",
      height: "100%",
    },
    imagePlaceholder: {
      backgroundColor: colors.surface,
      zIndex: 1,
    },
    defaultBadge: {
      position: "absolute",
      bottom: 4,
      left: 4,
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
      backgroundColor: colors.accentOrange,
      borderRadius: radius.sm,
      paddingHorizontal: 5,
      paddingVertical: 2,
    },
    defaultBadgeText: {
      fontSize: 9,
      fontWeight: "700",
      color: colors.white,
    },
    settingsButton: {
      position: "absolute",
      top: 4,
      right: 4,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.white,
      alignItems: "center",
      justifyContent: "center",
    },
    settingsButtonActive: {
      backgroundColor: colors.primaryGreenSoft,
    },
    photoActionsWrap: {
      position: "absolute",
      top: 1,
      right: 1,
      zIndex: 20,
      elevation: 20,
      alignItems: "flex-end",
    },
    photoActionsMenu: {
      position: "absolute",
      top: 30,
      right: 4,
      width: 164,
      paddingVertical: spacing.xs,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      zIndex: 999,
      elevation: 999,
      shadowColor: "#000",
      shadowOpacity: 0.14,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 6,
      },
    },
    photoActionsMenuItem: {
      minHeight: 40,
      paddingHorizontal: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    photoActionsMenuItemDisabled: {
      opacity: 0.6,
    },
    photoActionsMenuText: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.accentOrange,
    },
    emptyState: {
      alignItems: "center",
      paddingTop: spacing.xl,
      gap: spacing.sm,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    emptyCaption: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: "center",
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
