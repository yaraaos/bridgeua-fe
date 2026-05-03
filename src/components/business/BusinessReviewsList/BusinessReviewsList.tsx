import ReviewCard from "@/src/components/business/ReviewCard";
import type { BusinessDetailsReview } from "@/src/features/businesses/types/business.types";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "./BusinessReviewsList.styles";

type Props = {
  reviews: BusinessDetailsReview[];
  reviewCount: number;
};

export default function BusinessReviewsList({ reviews, reviewCount }: Props) {
  if (reviews.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No reviews yet</Text>
        <Text style={styles.emptyText}>
          Be the first to review this business.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reviews</Text>
        <Text style={styles.subtitle}>{reviewCount} reviews</Text>
      </View>

      <View style={styles.list}>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </View>
    </View>
  );
}