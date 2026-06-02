import { FollowButton } from "@/src/components/business";
import RecommendButton from "@/src/components/business/RecommendButton";
import AppLabel from "@/src/components/ui/AppLabel/AppLabel";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import { useBusinessReviewSummary } from "@/src/features/reviews/hooks/useBusinessReviewSummary";
import { useAuthStore } from "@/src/store/auth.store";
import { Business } from "@/src/types/business";
import { createStyles } from "./BusinessCard.styles";

type Props = {
  business: Business;
  onPress?: () => void;
  variant?: "default" | "compact" | "embedded";
  showFollowButton?: boolean;
  isOwnedBusiness?: boolean;
};

export default function BusinessCard({
                                       business,
                                       onPress,
                                       variant = "default",
                                       showFollowButton = true,
                                       isOwnedBusiness = false,
                                     }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const accountType = useAuthStore((state) => state.user?.accountType);
  const isBusinessAccount = accountType === "business";

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
        isOwnedBusiness && styles.ownedCard,
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
          <View style={styles.nameRow}>
            <Text style={[styles.name, { flex: 1, marginRight: 8 }]} numberOfLines={1}>
              {business.name}
            </Text>

            {isOwnedBusiness ? (
              <AppLabel label="Your business" variant="your-business" />
            ) : null}
          </View>

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

          {typeof business.isOpen === 'boolean' ? (
            <View style={styles.openStatusRow}>
              <Text style={[
                styles.openStatusText,
                { color: business.isOpen ? colors.primaryGreen : colors.error },
              ]}>
                {business.isOpen ? 'Open' : 'Closed'}
              </Text>
              {(business.isOpen ? business.closesAt : business.opensAt) ? (
                <Text style={[styles.openStatusText, { color: colors.white }]}>
                  {` · ${business.isOpen ? `Closes at ${business.closesAt}` : `Opens at ${business.opensAt}`}`}
                </Text>
              ) : null}
            </View>
          ) : null}

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

        {showFollowButton && !isOwnedBusiness ? (
          <View style={styles.actionSlot}>
            {isBusinessAccount ? (
              <RecommendButton businessId={String(business.id)} businessName={business.name} />
            ) : (
              <FollowButton
                businessId={String(business.id)}
                size="icon"
                variant="soft"
              />
            )}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
