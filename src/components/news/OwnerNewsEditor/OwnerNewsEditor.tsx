import AppAvatar from "@/src/components/ui/AppAvatar/AppAvatar";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppText from "@/src/components/ui/AppText/AppText";
import type { AppColors } from "@/src/constants/colors";
import { useMyBusinessProfile } from "@/src/features/businesses/hooks/useBusiness";
import type { NewsDraft } from "@/src/features/news/types/news.types";
import type { NewsCtaType } from "@/src/features/news/types/news.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import {
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
};

const CTA_OPTIONS: Array<{ type: NewsCtaType; label: string }> = [
  { type: "view_business", label: "View Business" },
  { type: "view_menu", label: "View Services" },
  { type: "view_address", label: "View Address" },
];

export default function OwnerNewsEditor({
  visible,
  draft,
  onChangeDraft,
  onCancel,
  onSave,
  onPublish,
  onUnpublish,
  onDelete,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { business } = useMyBusinessProfile();

  const isExistingNews = !!draft.id;
  const isPublished = draft.status === "published";

  const updateDraft = (patch: Partial<NewsDraft>) => {
    onChangeDraft({ ...draft, ...patch });
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
    }
  };

  const hasImage =
    !!draft.imageUrl &&
    (draft.imageUrl.startsWith("file://") ||
      draft.imageUrl.startsWith("http"));

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <AppText style={styles.headerTitle}>
            {isExistingNews ? "Edit news" : "Create news"}
          </AppText>
          <Pressable style={styles.closeButton} onPress={onCancel} hitSlop={12}>
            <Ionicons name="close" size={22} color={colors.textSecondary} />
          </Pressable>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <TextInput
            placeholder="News title"
            placeholderTextColor={colors.textMuted}
            value={draft.title}
            onChangeText={(t) => updateDraft({ title: t })}
            style={styles.titleInput}
            multiline
          />

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

          {hasImage ? (
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: draft.imageUrl }}
                style={styles.heroImage}
              />
              <Pressable style={styles.imageEditOverlay} onPress={pickImage}>
                <Ionicons name="camera-outline" size={20} color={colors.white} />
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.imagePlaceholder} onPress={pickImage}>
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
                  {business.category} • {business.location}
                </AppText>
              </View>
            </View>
          )}

          <View style={styles.sectionCard}>
            <AppText style={styles.sectionTitle}>About</AppText>
            <TextInput
              placeholder="Write your news content here..."
              placeholderTextColor={colors.textMuted}
              value={draft.content}
              onChangeText={(t) => updateDraft({ content: t })}
              style={styles.textAreaInput}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.ctaRow}>
            {CTA_OPTIONS.map((opt) => (
              <Pressable
                key={opt.type}
                style={[
                  styles.ctaPill,
                  draft.ctaType === opt.type && styles.ctaPillActive,
                ]}
                onPress={() =>
                  updateDraft({ ctaType: opt.type, ctaLabel: opt.label })
                }
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
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <View style={styles.footerButton}>
              <AppButton title="Cancel" onPress={onCancel} variant="secondary" />
            </View>
            <View style={styles.footerButton}>
              <AppButton
                title="Save draft"
                onPress={onSave}
                variant="secondary"
              />
            </View>
          </View>
          <AppButton
            title={isPublished ? "Unpublish" : "Publish"}
            onPress={isPublished ? onUnpublish : onPublish}
            variant="primary"
          />
          {isExistingNews && onDelete ? (
            <AppButton title="Delete news" onPress={onDelete} variant="ghost" />
          ) : null}
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
      fontSize: 22,
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
    titleInput: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.textPrimary,
      paddingVertical: 0,
    },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    dateText: {
      fontSize: 13,
      color: colors.textMuted,
    },
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
    ctaRow: {
      flexDirection: "row",
      gap: 8,
      flexWrap: "wrap",
    },
    ctaPill: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
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
  });
}
