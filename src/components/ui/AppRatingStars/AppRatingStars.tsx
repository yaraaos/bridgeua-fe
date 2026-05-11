import { useAppTheme } from "@/src/hooks/useAppTheme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { createStyles } from "./AppRatingStars.styles";

type Props = {
  rating: number;
  max?: number;
  size?: number;
};

export default function RatingStars({ rating, max = 5, size = 18 }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(size);

  const normalizedRating = Math.max(0, Math.min(max, rating));

  return (
    <View style={styles.container}>
      {Array.from({ length: max }).map((_, index) => {
        const starFill = Math.max(0, Math.min(1, normalizedRating - index));

        return (
          <View key={index} style={styles.starWrap}>
            <MaterialIcons
              name="star-border"
              size={size}
              color={colors.accentOrange}
              style={styles.emptyStar}
            />

            <View
              style={[styles.filledStarClip, { width: `${starFill * 100}%` }]}
            >
              <MaterialIcons
                name="star"
                size={size}
                color={colors.accentOrange}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}
