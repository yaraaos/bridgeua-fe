import { FollowButton } from "@/src/components/business";
import GradientHeader from "@/src/components/ui/GradientHeader/GradientHeader";
import { DISCOVERY_GRADIENT } from "@/src/constants/gradients";
import type { BusinessDetails } from "@/src/features/businesses/types/business.types";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./BusinessHeader.styles";

type Props = {
  business: BusinessDetails;
};

export default function BusinessHeader({ business }: Props) {
  return (
    <GradientHeader colors={DISCOVERY_GRADIENT}>
      <View style={styles.container}>
        <View style={styles.contentRow}>
          <Image
            source={{ uri: business.images[0]?.url }}
            style={styles.logo}
          />

          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {business.name}
            </Text>

            <View style={styles.ratingRow}>
              {Array.from({ length: 5 }).map((_, index) => (
                <MaterialIcons
                  key={index}
                  name={
                    index < Math.round(business.rating) ? "star" : "star-border"
                  }
                  size={13}
                  color="#F79A2E"
                />
              ))}

              <Text style={styles.ratingText}>
                {business.rating.toFixed(1)} ({business.reviewCount} reviews)
              </Text>
            </View>

            <Text style={styles.meta} numberOfLines={1}>
              {business.category} / {business.location}
            </Text>
          </View>

          <View style={styles.rightActions}>
            <FollowButton businessId={business.id} size="sm" variant="filled" />

            <Pressable style={styles.shareButton}>
              <Ionicons name="share-outline" size={17} color="#1F5E46" />
            </Pressable>
          </View>
        </View>
      </View>
    </GradientHeader>
  );
}
