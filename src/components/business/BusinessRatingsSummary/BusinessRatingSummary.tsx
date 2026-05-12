import type { BusinessRatingBreakdownItem } from "@/src/features/businesses/types/business.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import React from "react";
import { Text, View } from "react-native";
import RatingStars from "../../ui/AppRatingStars";
import { createStyles } from "./BusinessRatingSummary.styles";

type Props = {
  rating: number;
  reviewCount: number;
  breakdown: BusinessRatingBreakdownItem[];
};

export default function BusinessRatingSummary({
  rating,
  reviewCount,
  breakdown,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  if (reviewCount === 0) {
    return null;
  }
  const maxCount = Math.max(...breakdown.map((item) => item.count), 1);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.rating}>{rating.toFixed(1)}</Text>

        <View style={styles.starsRow}>
          <RatingStars rating={rating} size={18} />
        </View>

        <Text style={styles.reviewCount}>{reviewCount} reviews</Text>
      </View>

      <View style={styles.right}>
        {breakdown.map((item) => (
          <View key={item.rating} style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>{item.rating}</Text>

            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { width: `${(item.count / maxCount) * 100}%` },
                ]}
              />
            </View>

            <Text style={styles.breakdownCount}>{item.count}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
