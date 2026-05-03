import ReviewCard from "@/src/components/business/ReviewCard";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import type {
    BusinessDetailsReview,
    BusinessReviewPhoto,
} from "@/src/features/businesses/types/business.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./BusinessReviewsList.styles";

type Props = {
  reviews: BusinessDetailsReview[];
  reviewCount: number;
  reviewPhotos: BusinessReviewPhoto[];
  onPressWriteReview?: () => void;
};

const FILTERS = ["Most relevant", "Newest", "Highest", "Lowest"];

export default function BusinessReviewsList({
  reviews,
  reviewCount,
  reviewPhotos,
  onPressWriteReview,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.writeCard}>
        <Text style={styles.writeTitle}>Write a review</Text>

        <View style={styles.writeStars}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Ionicons
              key={index}
              name="star-outline"
              size={30}
              style={styles.writeStar}
            />
          ))}
        </View>

        <Text style={styles.writeHint}>
          Share your experience and help the community.
        </Text>

        <AppButton title="Write a review" onPress={onPressWriteReview} />
      </View>

      {reviewPhotos.length > 0 ? (
        <View style={styles.photosSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Photos from reviews</Text>
          </View>

          <View style={styles.photosRow}>
            {reviewPhotos.slice(0, 3).map((photo) => (
              <Image
                key={photo.id}
                source={{ uri: photo.url }}
                style={styles.reviewPhoto}
              />
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.filtersRow}>
        {FILTERS.map((filter, index) => (
          <Pressable
            key={filter}
            style={[styles.filterChip, index === 0 && styles.filterChipActive]}
          >
            <Text
              style={[
                styles.filterText,
                index === 0 && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>All reviews</Text>
        <Text style={styles.reviewCount}>{reviewCount} total</Text>
      </View>

      <View style={styles.list}>
        {reviews.map((review, index) => (
          <View key={review.id}>
            <ReviewCard review={review} />

            {index < reviews.length - 1 ? (
              <View style={styles.separator} />
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
