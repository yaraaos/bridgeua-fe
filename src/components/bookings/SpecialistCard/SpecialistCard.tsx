//src/components/bookings/SpecialistCard/SpecialistCard.tsx

import React from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { createStyles } from "./SpecialistCard.styles";

export type SpecialistCardProps = {
  name: string;
  role: string;
  description?: string;
  avatarUrl?: string;
  isSelected?: boolean;
  badgeText?: string;
  onPress?: () => void;
  isLoadingSlot?: boolean;
  earliestSlot?: string | null;
};

export default function SpecialistCard({
  name,
  role,
  description,
  avatarUrl,
  isSelected = false,
  badgeText,
  onPress,
  isLoadingSlot,
  earliestSlot,
}: SpecialistCardProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

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
            <MaterialIcons name="person" size={24} color={colors.primaryGreen} />
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

{!!description && (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          )}

          {isLoadingSlot ? (
            <ActivityIndicator size="small" color={styles.slotUnavailable.color} style={styles.slotLoader} />
          ) : isLoadingSlot === false || earliestSlot !== undefined ? (
            <Text style={earliestSlot ? styles.slotAvailable : styles.slotUnavailable}>
              {earliestSlot ?? "No availability"}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
        {isSelected && <MaterialIcons name="check" size={14} color={colors.white} />}
      </View>
    </Pressable>
  );
}