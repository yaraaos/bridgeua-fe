import ReviewCard from "@/src/components/business/ReviewCard";
import type { BusinessDetailsReview } from "@/src/features/businesses/types/business.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { styles } from "./BusinessTopReviews.styles";

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
  const previewReviews = reviews.slice(0, 6);

  if (previewReviews.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Top reviews</Text>

        <Pressable style={styles.viewAllButton} onPress={onPressViewAll}>
          <Text style={styles.viewAllText}>View all</Text>
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
