//src/components/bookings/SpecialistCard/SpecialistCard.tsx

import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "./SpecialistCard.styles";

export type SpecialistCardProps = {
  name: string;
  role: string;
  rating: number;
  reviewsCount: number;
  description?: string;
  avatarUrl?: string;
  isSelected?: boolean;
  badgeText?: string;
  onPress?: () => void;
};

export default function SpecialistCard({
  name,
  role,
  rating,
  reviewsCount,
  description,
  avatarUrl,
  isSelected = false,
  badgeText,
  onPress,
}: SpecialistCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, isSelected && styles.cardSelected]}
    >
      <View style={styles.left}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <MaterialIcons name="person" size={24} color="#1F5E46" />
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.nameWrap}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.role}>{role}</Text>
            </View>

            {badgeText ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badgeText}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.ratingRow}>
            <MaterialIcons name="star" size={14} color="#F79A2E" />
            <Text style={styles.ratingText}>
              {rating.toFixed(1)} ({reviewsCount} reviews)
            </Text>
          </View>

          {!!description && (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          )}
        </View>
      </View>

      <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
        {isSelected && <MaterialIcons name="check" size={14} color="#FFFFFF" />}
      </View>
    </Pressable>
  );
}