import { RatingBadge } from "@/src/components/common";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Business } from "../../../types/business";
import FollowButton from "../FollowButton/FollowButton";
import { styles } from "./BusinessCard.styles";

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

      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {business.name}
          </Text>

          <View style={styles.rightSide}>
            <RatingBadge
              rating={business.rating}
              compact={variant === "compact"}
            />

            {showFollowButton ? (
              <FollowButton businessId={String(business.id)} />
            ) : null}
          </View>
        </View>

        <Text style={styles.meta} numberOfLines={1}>
          {business.category}
        </Text>

        <Text style={styles.meta} numberOfLines={1}>
          {business.location}
        </Text>

        {!!business.recommendedBy && (
          <Text style={styles.recommended} numberOfLines={1}>
            {business.recommendedBy}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
