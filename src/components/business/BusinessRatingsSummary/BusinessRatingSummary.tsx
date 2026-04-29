import { colors } from "@/src/constants/colors";
import type { BusinessRatingBreakdownItem } from "@/src/features/businesses/types/business.types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "./BusinessRatingSummary.styles";

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
  const maxCount = Math.max(...breakdown.map((item) => item.count), 1);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.rating}>{rating.toFixed(1)}</Text>

        <View style={styles.starsRow}>
          {Array.from({ length: 5 }).map((_, index) => (
            <MaterialIcons
              key={index}
              name={index < Math.round(rating) ? "star" : "star-border"}
              size={18}
              color={colors.accentOrange}
            />
          ))}
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