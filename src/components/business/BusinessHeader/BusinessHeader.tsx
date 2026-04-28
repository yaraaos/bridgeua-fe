import { FollowButton } from "@/src/components/business";
import { RatingBadge } from "@/src/components/common";
import type { BusinessDetails } from "@/src/features/businesses/types/business.types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./BusinessHeader.styles";

type Props = {
  business: BusinessDetails;
};

export default function BusinessDetailsHeader({ business }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#161616" />
        </Pressable>

        <View style={styles.rightActions}>
          <Pressable style={styles.iconButton}>
            <Ionicons name="share-outline" size={20} color="#161616" />
          </Pressable>

          <Pressable style={styles.iconButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#161616" />
          </Pressable>
        </View>
      </View>

      <View style={styles.mainRow}>
        <Image source={{ uri: business.images[0]?.url }} style={styles.logo} />

        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>
              {business.name}
            </Text>

            <RatingBadge rating={business.rating} compact />
          </View>

          <Text style={styles.meta} numberOfLines={1}>
            {business.category}
          </Text>

          <Text style={styles.meta} numberOfLines={1}>
            {business.location}
          </Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.reviewText}>
          {business.reviewCount} reviews
        </Text>

        <FollowButton businessId={business.id} size="md" variant="outline" />
      </View>
    </View>
  );
}