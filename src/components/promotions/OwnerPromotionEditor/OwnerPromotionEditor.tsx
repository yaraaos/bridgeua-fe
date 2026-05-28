import PromotionCard from "@/src/components/promotions/PromotionCard";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppText from "@/src/components/ui/AppText/AppText";
import type { PromotionDraft } from "@/src/features/promotions/types/promotion.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, ScrollView, TextInput, View } from "react-native";
import { createStyles } from "./OwnerPromotionEditor.styles";

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

const textToList = (value?: string) =>
  value
    ?.split("\n")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

const listToText = (value?: string[]) => value?.join("\n") ?? "";

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

  const isExistingPromotion = !!draft.id;
  const isPublished = draft.status === "published";

  const updateDraft = (patch: Partial<PromotionDraft>) => {
    onChangeDraft({
      ...draft,
      ...patch,
    });
  };

  const previewPromotion = React.useMemo(() => {
    return {
      id: draft.id || "preview",
      businessId: draft.businessId || "local-business",
      title: draft.title || "Promotion title",
      subtitle: draft.subtitle,
      description: draft.description || "Promotion description",
      imageUrl: draft.imageUrl || "https://placehold.co/600x400",
      categoryLabel: draft.categoryLabel || "Promotion",
      startsAt: draft.startsAt,
      expiresAt: draft.expiresAt,
      endsAt: draft.endsAt,
      isActive: draft.status === "published",
      status: draft.status,
      promoCode: draft.promoCode,
      discountLabel: draft.discountLabel,
      redemptionType: draft.redemptionType,
      redemptionInstructions: draft.redemptionInstructions,
      offerDetails: draft.offerDetails,
      terms: draft.terms,
      ctaType: draft.ctaType,
      ctaLabel: draft.ctaLabel || "View",
      business: undefined,
    } as any;
  }, [draft]);

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
          <View style={styles.card}>
            <AppText style={styles.sectionTitle}>Main info</AppText>

            <AppText style={styles.label}>Title</AppText>
            <TextInput
              placeholder="Example: 20% off manicure"
              placeholderTextColor={colors.textSecondary}
              value={draft.title}
              onChangeText={(text) => updateDraft({ title: text })}
              style={styles.field}
            />

            <AppText style={styles.label}>Subtitle</AppText>
            <TextInput
              placeholder="Example: Special offer for followers"
              placeholderTextColor={colors.textSecondary}
              value={draft.subtitle}
              onChangeText={(text) => updateDraft({ subtitle: text })}
              style={styles.field}
            />

            <AppText style={styles.label}>Description</AppText>
            <TextInput
              placeholder="Describe the offer"
              placeholderTextColor={colors.textSecondary}
              value={draft.description}
              onChangeText={(text) => updateDraft({ description: text })}
              style={[styles.field, styles.textArea]}
              multiline
            />

            <AppText style={styles.label}>Image URL</AppText>
            <TextInput
              placeholder="Image URL"
              placeholderTextColor={colors.textSecondary}
              value={draft.imageUrl}
              onChangeText={(text) => updateDraft({ imageUrl: text })}
              style={styles.field}
              autoCapitalize="none"
            />

            <AppText style={styles.label}>Category label</AppText>
            <TextInput
              placeholder="Promotion"
              placeholderTextColor={colors.textSecondary}
              value={draft.categoryLabel}
              onChangeText={(text) => updateDraft({ categoryLabel: text })}
              style={styles.field}
            />
          </View>

          <View style={styles.card}>
            <AppText style={styles.sectionTitle}>Offer</AppText>

            <AppText style={styles.label}>Discount label</AppText>
            <TextInput
              placeholder="Example: 20% OFF"
              placeholderTextColor={colors.textSecondary}
              value={draft.discountLabel}
              onChangeText={(text) => updateDraft({ discountLabel: text })}
              style={styles.field}
            />

            <AppText style={styles.label}>Promo code</AppText>
            <TextInput
              placeholder="Example: BRIDGE20"
              placeholderTextColor={colors.textSecondary}
              value={draft.promoCode}
              onChangeText={(text) => updateDraft({ promoCode: text })}
              style={styles.field}
              autoCapitalize="characters"
            />

            <AppText style={styles.label}>Redemption instructions</AppText>
            <TextInput
              placeholder="Example: Show this code when booking"
              placeholderTextColor={colors.textSecondary}
              value={draft.redemptionInstructions}
              onChangeText={(text) =>
                updateDraft({ redemptionInstructions: text })
              }
              style={[styles.field, styles.textAreaSmall]}
              multiline
            />

            <AppText style={styles.label}>Offer details</AppText>
            <TextInput
              placeholder={
                "One detail per line\nExample: Valid for new clients"
              }
              placeholderTextColor={colors.textSecondary}
              value={listToText(draft.offerDetails)}
              onChangeText={(text) =>
                updateDraft({ offerDetails: textToList(text) })
              }
              style={[styles.field, styles.textArea]}
              multiline
            />

            <AppText style={styles.label}>Terms</AppText>
            <TextInput
              placeholder={"One term per line\nExample: Cannot be combined"}
              placeholderTextColor={colors.textSecondary}
              value={listToText(draft.terms)}
              onChangeText={(text) => updateDraft({ terms: textToList(text) })}
              style={[styles.field, styles.textArea]}
              multiline
            />
          </View>

          <View style={styles.card}>
            <AppText style={styles.sectionTitle}>Dates and CTA</AppText>

            <AppText style={styles.label}>Starts at</AppText>
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textSecondary}
              value={draft.startsAt}
              onChangeText={(text) => updateDraft({ startsAt: text })}
              style={styles.field}
            />

            <AppText style={styles.label}>Expires at</AppText>
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textSecondary}
              value={draft.expiresAt}
              onChangeText={(text) => updateDraft({ expiresAt: text })}
              style={styles.field}
            />

            <AppText style={styles.label}>Ends at</AppText>
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textSecondary}
              value={draft.endsAt}
              onChangeText={(text) => updateDraft({ endsAt: text })}
              style={styles.field}
            />

            <AppText style={styles.label}>Button label</AppText>
            <TextInput
              placeholder="Book Now"
              placeholderTextColor={colors.textSecondary}
              value={draft.ctaLabel}
              onChangeText={(text) => updateDraft({ ctaLabel: text })}
              style={styles.field}
            />
          </View>

          <AppText style={styles.previewTitle}>Preview</AppText>

          <View style={styles.previewWrap}>
            <PromotionCard promotion={previewPromotion} onPress={() => {}} />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <View style={styles.footerButton}>
              <AppButton
                title="Cancel"
                onPress={onCancel}
                variant="secondary"
              />
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
    </Modal>
  );
}
