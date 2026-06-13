import ReviewCard from "@/src/components/business/ReviewCard";
import type { BusinessDetailsReview } from "@/src/features/businesses/types/business.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, Text, View } from "react-native";
import { createStyles } from "./BusinessTopReviews.styles";

type Props = {
  reviews: BusinessDetailsReview[];
  reviewCount: number;
  onPressViewAll?: () => void;
  onPressReviewMore?: (reviewId: string) => void;
};

export default function BusinessTopReviews({
  reviews,
  onPressViewAll,
  onPressReviewMore,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const previewReviews = reviews.slice(0, 6);

  if (previewReviews.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("business.topReviews")}</Text>

        <Pressable style={styles.viewAllButton} onPress={onPressViewAll}>
          <Text style={styles.viewAllText}>{t("business.viewAll")}</Text>
          <Ionicons
            name="chevron-forward"
            size={14}
            style={styles.viewAllIcon}
          />
        </Pressable>
      </View>

      <FlatList
        horizontal
        data={previewReviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReviewCard
            review={item}
            variant="preview"
            onPressMore={onPressReviewMore}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}