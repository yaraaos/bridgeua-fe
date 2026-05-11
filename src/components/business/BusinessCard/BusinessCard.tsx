import { FollowButton } from "@/src/components/business";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import { Business } from "@/src/types/business";
import { createStyles } from "./BusinessCard.styles";

type Props = {
  business: Business;
  onPress?: () => void;
  variant?: "default" | "compact";
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

  const recommendedByText = business.recommendedBy
    ?.replace(/^Recommended by\s*/i, "")
    .trim();

  return (
    <Pressable
      style={[styles.card, variant === "compact" && styles.cardCompact]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Image
        source={{ uri: business.image }}
        style={[styles.image, variant === "compact" && styles.imageCompact]}
      />

      <View style={styles.content}>
        <View style={styles.textContent}>
          <Text style={styles.name} numberOfLines={1}>
            {business.name}
          </Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color={colors.accentOrange} />

            <Text style={styles.ratingText}>{business.rating.toFixed(1)}</Text>
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

          {!!recommendedByText && (
            <Text style={styles.recommendedBy} numberOfLines={1}>
              Recommended by {recommendedByText}
            </Text>
          )}
        </View>

        {showFollowButton ? (
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
