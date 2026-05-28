import { FollowButton } from "@/src/components/business";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import { useAuthStore } from "@/src/store/auth.store";
import { useBusinessReviewSummary } from "@/src/features/reviews/hooks/useBusinessReviewSummary";
import { Business } from "@/src/types/business";
import { createStyles } from "./BusinessCard.styles";

type Props = {
  business: Business;
  onPress?: () => void;
  variant?: "default" | "compact" | "embedded";
  showFollowButton?: boolean;
};

export default function BusinessCard({
  business,
  onPress,
  variant = "default",
  showFollowButton = true,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const accountType = useAuthStore((state) => state.user?.accountType);
  const isBusinessOwner = accountType === 'business';

  const recommendedByPreview = business.recommendedByPreview ?? [];
  const recommendedByCount = business.recommendedByCount ?? 0;
  const recommendedPreview = recommendedByPreview.join(", ");
  const reviewSummary = useBusinessReviewSummary({
    businessId: String(business.id),
    fallbackRating: business.rating,
    fallbackReviewCount: 0,
  });

  return (
    <Pressable
      style={[
        styles.card,
        variant === "compact" && styles.cardCompact,
        variant === "embedded" && styles.cardEmbedded,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Image
        source={{
          uri: business.avatarUrl ?? business.image,
        }}
        style={[
          styles.image,
          variant === "compact" && styles.imageCompact,
          variant === "embedded" && styles.imageEmbedded,
        ]}
      />

      <View style={styles.content}>
        <View style={styles.textContent}>
          <Text style={styles.name} numberOfLines={1}>
            {business.name}
          </Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color={colors.accentOrange} />

            <Text style={styles.ratingText}>
              {reviewSummary.rating.toFixed(1)}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaText} numberOfLines={1}>
              {business.category}
            </Text>

            <Text style={styles.dot}>•</Text>

            <Text style={styles.metaText} numberOfLines={1}>
              {business.location}
            </Text>
          </View>

          {!!recommendedByPreview.length && (
            <View style={styles.recommendedRow}>
              <Text style={styles.recommendedLabel} numberOfLines={1}>
                Recommended by {recommendedPreview}
              </Text>

              {recommendedByCount > 0 ? (
                <Text style={styles.recommendedCount} numberOfLines={1}>
                  +{recommendedByCount}
                </Text>
              ) : null}
            </View>
          )}
        </View>

        {showFollowButton && !isBusinessOwner ? (
          <View style={styles.actionSlot}>
            <FollowButton
              businessId={String(business.id)}
              size="icon"
              variant="soft"
            />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
