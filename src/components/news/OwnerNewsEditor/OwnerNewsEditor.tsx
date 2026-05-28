import FollowingFeedCard from "@/src/components/following/FollowingFeedCard";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppText from "@/src/components/ui/AppText/AppText";
import type { FollowingFeedCardItem } from "@/src/features/following/types/following.types";
import type { NewsDraft } from "@/src/features/news/types/news.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, ScrollView, TextInput, View } from "react-native";
import { createStyles } from "./OwnerNewsEditor.styles";

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

  const isExistingNews = !!draft.id;
  const isPublished = draft.status === "published";

  const updateDraft = (patch: Partial<NewsDraft>) => {
    onChangeDraft({
      ...draft,
      ...patch,
    });
  };

  const previewItem: FollowingFeedCardItem = {
    id: draft.id || "news-preview",
    businessId: draft.businessId,
    type: "news",
    newsId: draft.id || "news-preview",
    title: draft.title || "News title",
    description: draft.description || "News short description",
    createdAt: draft.publishedAt || new Date().toISOString(),
    businessName: "Your Business",
    businessCategory: "Business",
    businessLocation: "California, USA",
    businessImage: draft.imageUrl || "https://placehold.co/600x400",
    businessRating: 0,
    businessDistanceKm: 0,
    businessPriceLevel: undefined,
    distanceKm: 0,
    priceLevel: undefined,
    recommendedByPreview: [],
    recommendedByCount: 0,
    status: draft.status,
  };

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
          <View style={styles.card}>
            <AppText style={styles.label}>Title</AppText>
            <TextInput
              placeholder="Example: Updated working hours"
              placeholderTextColor={colors.textSecondary}
              value={draft.title}
              onChangeText={(text) => updateDraft({ title: text })}
              style={styles.field}
            />

            <AppText style={styles.label}>Short description</AppText>
            <TextInput
              placeholder="Short description for the feed card"
              placeholderTextColor={colors.textSecondary}
              value={draft.description}
              onChangeText={(text) => updateDraft({ description: text })}
              style={[styles.field, styles.textAreaSmall]}
              multiline
            />

            <AppText style={styles.label}>Full content</AppText>
            <TextInput
              placeholder="Full news content"
              placeholderTextColor={colors.textSecondary}
              value={draft.content}
              onChangeText={(text) => updateDraft({ content: text })}
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
              placeholder="News"
              placeholderTextColor={colors.textSecondary}
              value={draft.categoryLabel}
              onChangeText={(text) => updateDraft({ categoryLabel: text })}
              style={styles.field}
            />

            <AppText style={styles.label}>CTA label</AppText>
            <TextInput
              placeholder="View Business"
              placeholderTextColor={colors.textSecondary}
              value={draft.ctaLabel}
              onChangeText={(text) => updateDraft({ ctaLabel: text })}
              style={styles.field}
            />
          </View>

          <AppText style={styles.previewTitle}>Preview</AppText>

          <FollowingFeedCard item={previewItem} onPress={() => {}} />
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

          {isExistingNews && onDelete ? (
            <AppButton title="Delete news" onPress={onDelete} variant="ghost" />
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
