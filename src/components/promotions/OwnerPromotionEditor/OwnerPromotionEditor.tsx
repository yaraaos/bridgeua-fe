import AppAvatar from "@/src/components/ui/AppAvatar/AppAvatar";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppText from "@/src/components/ui/AppText/AppText";
import type { AppColors } from "@/src/constants/colors";
import { useMyBusinessProfile } from "@/src/features/businesses/hooks/useBusiness";
import type { PromotionDraft } from "@/src/features/promotions/types/promotion.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
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
  draft: PromotionDraft;
  onChangeDraft: (draft: PromotionDraft) => void;
  onCancel: () => void;
  onSave: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete?: () => void;
};

export default function OwnerPromotionEditor({
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

  const [showDateModal, setShowDateModal] = useState(false);
  const [dateInput, setDateInput] = useState(
    draft.expiresAt ?? draft.endsAt ?? ""
  );

  const isExistingPromotion = !!draft.id;
  const isPublished = draft.status === "published";

  const updateDraft = (patch: Partial<PromotionDraft>) => {
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

  const validUntil = draft.expiresAt ?? draft.endsAt;
  const formattedValidUntil = validUntil
    ? new Date(validUntil).toLocaleDateString()
    : null;

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
            {isExistingPromotion ? "Edit promotion" : "Create promotion"}
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
            placeholder="Promotion title"
            placeholderTextColor={colors.textMuted}
            value={draft.title}
            onChangeText={(t) => updateDraft({ title: t })}
            style={styles.titleInput}
            multiline
          />

          <TextInput
            placeholder="Short subtitle"
            placeholderTextColor={colors.textMuted}
            value={draft.subtitle}
            onChangeText={(t) => updateDraft({ subtitle: t })}
            style={styles.subtitleInput}
          />

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
            <AppText style={styles.sectionTitle}>Offer details</AppText>
            <TextInput
              placeholder="Describe the offer details (one per line)"
              placeholderTextColor={colors.textMuted}
              value={draft.offerDetails?.join("\n") ?? ""}
              onChangeText={(t) =>
                updateDraft({ offerDetails: t.split("\n") })
              }
              style={styles.textAreaInput}
              multiline
              textAlignVertical="top"
            />
            <Pressable
              style={styles.validityRow}
              onPress={() => setShowDateModal(true)}
            >
              <Ionicons
                name="calendar-outline"
                size={16}
                color={colors.textMuted}
              />
              <AppText
                style={[
                  styles.validityText,
                  !formattedValidUntil && { color: colors.textMuted },
                ]}
              >
                {formattedValidUntil
                  ? `Valid until ${formattedValidUntil}`
                  : "Set expiry date"}
              </AppText>
            </Pressable>
          </View>

          {!draft.promoCode ? (
            <Pressable
              style={styles.addRow}
              onPress={() => updateDraft({ promoCode: " " })}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={colors.primaryGreen}
              />
              <AppText style={styles.addRowText}>Add promo code</AppText>
            </Pressable>
          ) : (
            <View style={styles.sectionCard}>
              <AppText style={styles.sectionTitle}>Promo code</AppText>
              <View style={styles.promoCodePill}>
                <TextInput
                  value={draft.promoCode.trim()}
                  onChangeText={(t) => updateDraft({ promoCode: t })}
                  style={styles.promoCodeInput}
                  autoCapitalize="characters"
                />
              </View>
              <Pressable onPress={() => updateDraft({ promoCode: undefined })}>
                <AppText style={styles.removePromoText}>
                  Remove promo code
                </AppText>
              </Pressable>
            </View>
          )}

          <View style={styles.ctaRow}>
            <Pressable
              style={[
                styles.ctaPill,
                draft.ctaLabel === "Book Now" && styles.ctaPillActive,
              ]}
              onPress={() =>
                updateDraft({ ctaType: "book_now", ctaLabel: "Book Now" })
              }
            >
              <AppText
                style={[
                  styles.ctaPillText,
                  draft.ctaLabel === "Book Now" && styles.ctaPillTextActive,
                ]}
              >
                Book Now
              </AppText>
            </Pressable>
            <Pressable
              style={[
                styles.ctaPill,
                draft.ctaLabel === "Order Now" && styles.ctaPillActive,
              ]}
              onPress={() =>
                updateDraft({ ctaType: "book_now", ctaLabel: "Order Now" })
              }
            >
              <AppText
                style={[
                  styles.ctaPillText,
                  draft.ctaLabel === "Order Now" && styles.ctaPillTextActive,
                ]}
              >
                Order Now
              </AppText>
            </Pressable>
          </View>

          <View style={{ opacity: 0.6 }}>
            <View style={[styles.ctaPill, styles.ctaPillGreen]}>
              <AppText style={styles.ctaPillTextWhite}>View Business</AppText>
            </View>
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
          {isExistingPromotion && onDelete ? (
            <AppButton
              title="Delete promotion"
              onPress={onDelete}
              variant="ghost"
            />
          ) : null}
        </View>
      </View>

      <Modal
        visible={showDateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDateModal(false)}
      >
        <Pressable
          style={styles.dateOverlay}
          onPress={() => setShowDateModal(false)}
        >
          <Pressable style={styles.dateCard} onPress={() => {}}>
            <AppText style={styles.dateCardTitle}>Set expiry date</AppText>
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textMuted}
              value={dateInput}
              onChangeText={setDateInput}
              style={styles.dateInput}
            />
            <AppButton
              title="Confirm"
              variant="primary"
              onPress={() => {
                updateDraft({ expiresAt: dateInput });
                setShowDateModal(false);
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
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
    subtitleInput: {
      fontSize: 15,
      color: colors.textSecondary,
      paddingVertical: 4,
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
      minHeight: 80,
    },
    validityRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    validityText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    addRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    addRowText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.primaryGreen,
    },
    promoCodePill: {
      alignSelf: "flex-start",
      borderRadius: 999,
      borderWidth: 1.5,
      borderColor: colors.accentOrange,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginTop: 8,
    },
    promoCodeInput: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.accentOrange,
      paddingVertical: 0,
      minWidth: 60,
    },
    removePromoText: {
      fontSize: 12,
      color: colors.error,
      marginTop: 8,
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
    ctaPillGreen: {
      backgroundColor: colors.primaryGreen,
      borderColor: colors.primaryGreen,
    },
    ctaPillText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    ctaPillTextActive: {
      color: colors.white,
    },
    ctaPillTextWhite: {
      fontSize: 14,
      fontWeight: "600",
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
    dateOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      alignItems: "center",
      justifyContent: "center",
    },
    dateCard: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 24,
      width: "85%",
      gap: 16,
    },
    dateCardTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    dateInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      color: colors.textPrimary,
    },
  });
}
