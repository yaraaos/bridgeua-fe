import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "./RatingBadge.styles";

type Props = {
  rating: number;
  compact?: boolean;
};

export default function RatingBadge({ rating, compact = false }: Props) {
  return (
    <View
      style={[
        styles.container,
        compact && styles.containerCompact,
      ]}
    >
      <MaterialIcons
        name="star"
        size={compact ? 12 : 14}
        color="#F79A2E"
      />

      <Text
        style={[
          styles.text,
          compact && styles.textCompact,
        ]}
      >
        {rating.toFixed(1)}
      </Text>
    </View>
  );
}