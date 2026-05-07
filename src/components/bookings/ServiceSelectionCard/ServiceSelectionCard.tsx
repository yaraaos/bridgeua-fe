//src/components/bookings/ServiceSelectionCard/ServiceSelectionCard.tsx

import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { createStyles } from "./ServiceSelectionCard.styles";

export type ServiceSelectionCardProps = {
  title: string;
  duration: string;
  price: string;
  imageUrl?: string;
  isSelected?: boolean;
  subtitle?: string;
  onPress?: () => void;
};

export default function ServiceSelectionCard({
  title,
  duration,
  price,
  imageUrl,
  isSelected = false,
  subtitle,
  onPress,
}: ServiceSelectionCardProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, isSelected && styles.cardSelected]}
    >
      <View style={styles.left}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="spa" size={20} color={colors.primaryGreen} />
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{duration}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{price}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
        {isSelected && <MaterialIcons name="check" size={14} color={colors.white} />}
      </View>
    </Pressable>
  );
}