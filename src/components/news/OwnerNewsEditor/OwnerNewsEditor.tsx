import AppAvatar from "@/src/components/ui/AppAvatar/AppAvatar";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppText from "@/src/components/ui/AppText/AppText";
import type { AppColors } from "@/src/constants/colors";
import { useMyBusinessProfile } from "@/src/features/businesses/hooks/useBusiness";
import type {
  NewsCtaType,
  NewsDraft,
} from "@/src/features/news/types/news.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  draft: NewsDraft;
  onChangeDraft: (draft: NewsDraft) => void;
  onCancel: () => void;
  onSave: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete?: () => void;
  isPublishing?: boolean;
};

const CTA_OPTIONS: { type: NewsCtaType; label: string }[] = [
  { type: "view_menu", label: "View Services" },
  { type: "view_address", label: "View Address" },
  { type: "view_business", label: "View Business" },
];

export default function OwnerNewsEditor({
  visible,
  draft,
  onChangeDraft,
  onCancel,
  onSave,
  onPublish,
  onDelete,
  isPublishing,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { business } = useMyBusinessProfile();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible) {
      setErrors({});
    }
  }, [visible]);

  const isPublished = draft.status === "published";

  const updateDraft = (patch: Partial<NewsDraft>) => {
    onChangeDraft({ ...draft, ...patch });
  };

  const clearError = (key: string) => {
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      updateDraft({ imageUrl: result.assets[0].uri });
      clearError("image");
    }
  };

  const hasImage =
    !!draft.imageUrl &&
    (draft.imageUrl.startsWith("file://") || draft.imageUrl.startsWith("http"));

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!draft.title?.trim()) newErrors.title = "Title is required";
    if (!draft.subtitle?.trim()) newErrors.subtitle = "Subtitle is required";
    if (!draft.imageUrl) newErrors.image = "Cover image is required";
    if (!draft.content?.trim()) newErrors.content = "Content is required";
    if (!draft.ctaLabel) newErrors.ctaLabel = "Please select a call to action";
    return newErrors;
  };

  const handlePublish = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    setErrors({});
    onPublish();
  };

  const handleDelete = () => {
    Alert.alert("Delete news", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDelete?.() },
    ]);
  };

  // Published news — read-only detail view
  if (isPublished) {
    return (
      <Modal
        visible={visible}
        transparent={false}
        animationType="slide"
        onRequestClose={onCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pvHeader}>
            <Pressable onPress={onCancel} hitSlop={12}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={colors.textPrimary}
              />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <AppText style={styles.pvTitle}>{draft.title}</AppText>
            {!!draft.subtitle && (
              <AppText style={styles.pvSubtitle}>{draft.subtitle}</AppText>
            )}
            <AppText style={styles.pvDate}>
              {draft.publishedAt
                ? new Date(draft.publishedAt).toLocaleDateString()
                : new Date().toLocaleDateString()}
            </AppText>
            {!!draft.imageUrl && (
              <Image
                source={{ uri: draft.imageUrl }}
                style={styles.heroImage}
              />
            )}
            {!!business && (
              <View style={styles.businessCard}>
                <AppAvatar
                  size="sm"
                  imageUrl={business.avatarUrl}
                  name={business.name}
                />
                <View style={styles.businessInfo}>
                  <AppText style={styles.businessName}>{business.name}</AppText>
                  <AppText style={styles.businessMeta}>
                    {business.category}
                  </AppText>
                </View>
              </View>
            )}
            <View style={styles.sectionCard}>
              <AppText style={styles.sectionTitle}>About</AppText>
              <AppText style={styles.pvContent}>{draft.content}</AppText>
            </View>
            <View style={styles.pvActions}>
              <AppButton title={draft.ctaLabel ?? "View"} variant="primary" />
              <AppButton title="View Business" variant="secondary" />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.deleteButton} onPress={handleDelete}>
              <AppText style={styles.deleteButtonText}>Delete news</AppText>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <AppText style={styles.headerTitle}>
            {draft.id ? "Edit news" : "Create news"}
          </AppText>
          <Pressable style={styles.closeButton} onPress={onCancel} hitSlop={12}>
            <Ionicons name="close" size={22} color={colors.textSecondary} />
          </Pressable>
        </View>

        <ScrollView
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Title ── */}
          <View>
            <TextInput
              placeholder="News title"
              placeholderTextColor={colors.textMuted}
              value={draft.title}
              onChangeText={(t) => {
                updateDraft({ title: t });
                clearError("title");
              }}
              style={[
                styles.titleInput,
                !!errors.title && styles.titleInputError,
              ]}
              multiline
            />
            {!!errors.title && (
              <AppText style={styles.errorText}>{errors.title}</AppText>
            )}
          </View>

          {/* ── Subtitle ── */}
          <View>
            <TextInput
              placeholder="Short subtitle"
              placeholderTextColor={colors.textMuted}
              value={draft.subtitle ?? ''}
              onChangeText={(t) => updateDraft({ subtitle: t })}
              style={[
                styles.subtitleInput,
                !!errors.subtitle && styles.fieldError,
              ]}
            />
            {!!errors.subtitle && (
              <AppText style={styles.errorText}>{errors.subtitle}</AppText>
            )}
          </View>

          {/* ── Published date (static) ── */}
          <View style={styles.dateRow}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={colors.textMuted}
            />
            <AppText style={styles.dateText}>
              {new Date().toLocaleDateString()}
            </AppText>
          </View>

          {/* ── Image picker ── */}
          <View>
            {hasImage ? (
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: draft.imageUrl }}
                  style={styles.heroImage}
                />
                <Pressable style={styles.imageEditOverlay} onPress={pickImage}>
                  <Ionicons
                    name="camera-outline"
                    size={20}
                    color={colors.white}
                  />
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={[
                  styles.imagePlaceholder,
                  !!errors.image && { borderColor: colors.error },
                ]}
                onPress={pickImage}
              >
                <Ionicons
                  name="image-outline"
                  size={32}
                  color={colors.textMuted}
                />
                <AppText style={styles.imagePlaceholderText}>
                  Add cover image
                </AppText>
              </Pressable>
            )}
            {!!errors.image && (
              <AppText style={styles.errorText}>{errors.image}</AppText>
            )}
          </View>

          {/* ── Business card (static) ── */}
          {!!business && (
            <View style={styles.businessCard}>
              <AppAvatar
                size="sm"
                imageUrl={business.avatarUrl}
                name={business.name}
              />
              <View style={styles.businessInfo}>
                <AppText style={styles.businessName}>{business.name}</AppText>
                <AppText style={styles.businessMeta}>
                  {business.category}
                </AppText>
              </View>
            </View>
          )}

          {/* ── Content card ── */}
          <View>
            <View
              style={[
                styles.sectionCard,
                !!errors.content && { borderColor: colors.error },
              ]}
            >
              <AppText style={styles.sectionTitle}>About</AppText>
              <TextInput
                placeholder="Write your news content..."
                placeholderTextColor={colors.textMuted}
                value={draft.content}
                onChangeText={(t) => {
                  updateDraft({ content: t });
                  clearError("content");
                }}
                style={styles.textAreaInput}
                multiline
                textAlignVertical="top"
              />
            </View>
            {!!errors.content && (
              <AppText style={styles.errorText}>{errors.content}</AppText>
            )}
          </View>

          {/* ── CTA selector ── */}
          <View>
            <AppText style={styles.ctaSectionLabel}>Call to action</AppText>
            <View style={styles.ctaRow}>
              {CTA_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.type}
                  style={[
                    styles.ctaPill,
                    draft.ctaType === opt.type && styles.ctaPillActive,
                  ]}
                  onPress={() => {
                    updateDraft({ ctaType: opt.type, ctaLabel: opt.label });
                    clearError("ctaLabel");
                  }}
                >
                  <AppText
                    style={[
                      styles.ctaPillText,
                      draft.ctaType === opt.type && styles.ctaPillTextActive,
                    ]}
                  >
                    {opt.label}
                  </AppText>
                </Pressable>
              ))}
            </View>
            {!!errors.ctaLabel && (
              <AppText style={styles.errorText}>{errors.ctaLabel}</AppText>
            )}
          </View>
        </ScrollView>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <View style={styles.footerButton}>
              <AppButton title="Cancel" onPress={onCancel} variant="ghost" />
            </View>
            <View style={styles.footerButton}>
              <AppButton title="Save draft" onPress={onSave} variant="ghost" />
            </View>
          </View>
          <AppButton
            title={isPublishing ? "Publishing..." : "Publish"}
            onPress={handlePublish}
            variant="primary"
            disabled={isPublishing}
          />
          {!!draft.id && !!onDelete && (
            <Pressable style={styles.deleteButton} onPress={handleDelete}>
              <AppText style={styles.deleteButtonText}>Delete</AppText>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 56,
      paddingBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
      gap: 16,
    },

    // Title
    titleInput: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: "800",
      color: colors.textPrimary,
      paddingVertical: 4,
    },
    titleInputError: {
      borderBottomWidth: 1.5,
      borderBottomColor: colors.error,
    },
    subtitleInput: {
      fontSize: 15,
      color: colors.textSecondary,
      paddingVertical: 4,
    },
    fieldError: {
      borderBottomWidth: 1.5,
      borderBottomColor: colors.error,
    },
    errorText: {
      fontSize: 12,
      color: colors.error,
      marginTop: 4,
    },

    // Date row
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    dateText: {
      fontSize: 13,
      color: colors.textMuted,
    },

    // Image picker
    imageWrapper: {
      position: "relative",
    },
    heroImage: {
      width: "100%",
      height: 220,
      borderRadius: 18,
    },
    imageEditOverlay: {
      position: "absolute",
      bottom: 10,
      right: 10,
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: 8,
      borderRadius: 999,
    },
    imagePlaceholder: {
      height: 180,
      borderRadius: 18,
      borderWidth: 1.5,
      borderStyle: "dashed",
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    imagePlaceholderText: {
      fontSize: 14,
      color: colors.textMuted,
    },

    // Business card
    businessCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    businessInfo: {
      flex: 1,
    },
    businessName: {
      fontSize: 14,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    businessMeta: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },

    // Section card
    sectionCard: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.textPrimary,
      marginBottom: 8,
    },
    textAreaInput: {
      fontSize: 14,
      color: colors.textPrimary,
      minHeight: 120,
    },

    // CTA
    ctaSectionLabel: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.textPrimary,
      marginBottom: 8,
    },
    ctaRow: {
      flexDirection: "row",
      gap: 8,
      flexWrap: "wrap",
    },
    ctaPill: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: "center",
    },
    ctaPillActive: {
      backgroundColor: colors.accentOrange,
      borderColor: colors.accentOrange,
    },
    ctaPillText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    ctaPillTextActive: {
      color: colors.white,
    },

    // Footer
    footer: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 24,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
      gap: 8,
    },
    footerRow: {
      flexDirection: "row",
      gap: 8,
    },
    footerButton: {
      flex: 1,
    },
    deleteButton: {
      height: 52,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    deleteButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.error,
    },

    // Published notice (unused — kept for compatibility)
    publishedNotice: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      paddingHorizontal: 32,
    },
    publishedNoticeText: {
      fontSize: 15,
      color: colors.textMuted,
      textAlign: "center",
    },

    // Published view
    pvHeader: {
      paddingHorizontal: 16,
      paddingTop: 56,
      paddingBottom: 12,
    },
    pvTitle: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    pvSubtitle: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
      marginTop: 4,
    },
    pvDate: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textMuted,
    },
    pvContent: {
      fontSize: 15,
      lineHeight: 23,
      color: colors.textSecondary,
    },
    pvActions: {
      gap: 12,
    },
  });
}
