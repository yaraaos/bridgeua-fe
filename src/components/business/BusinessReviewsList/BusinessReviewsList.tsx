import ReviewCard from "@/src/components/business/ReviewCard";
import ImageGalleryModal from "@/src/components/common/ImageGalleryModal/ImageGalleryModal";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import type {
  BusinessDetailsReview,
  BusinessReviewPhoto,
} from "@/src/features/businesses/types/business.types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "./BusinessReviewsList.styles";
import ReviewFilters, {
  type ReviewFilterOption,
} from "@/src/components/business/ReviewFilters/ReviewFilters";

type Props = {
  reviews: BusinessDetailsReview[];
  reviewCount: number;
  reviewPhotos: BusinessReviewPhoto[];
  onPressWriteReview?: () => void;
  focusedReviewId?: string | null;
};

export default function BusinessReviewsList({
  reviews,
  reviewCount,
  reviewPhotos,
  focusedReviewId,
  onPressWriteReview,
}: Props) {
const [activeFilter, setActiveFilter] =
  useState<ReviewFilterOption>("Most relevant");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );
  const displayedReviews = focusedReviewId
    ? [
        ...reviews.filter((review) => review.id === focusedReviewId),
        ...reviews.filter((review) => review.id !== focusedReviewId),
      ]
    : reviews;

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
            <Text style={styles.sectionTitle}>Review photos</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photosRow}
          >
            {reviewPhotos.map((photo, index) => (
              <Pressable
                key={photo.id}
                onPress={() => setSelectedPhotoIndex(index)}
                style={styles.photoItem}
              >
                <Image source={{ uri: photo.url }} style={styles.reviewPhoto} />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      <ReviewFilters value={activeFilter} onChange={setActiveFilter} />

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>All reviews</Text>
        <Text style={styles.reviewCount}>{reviewCount} total</Text>
      </View>

      {displayedReviews.length === 0 ? (
        <AppEmptyState
          title="No reviews yet"
          description="Be the first to share your experience."
        />
      ) : (
        <View style={styles.list}>
          {displayedReviews.map((review, index) => (
            <View key={review.id}>
              <ReviewCard review={review} />

              {index < displayedReviews.length - 1 ? (
                <View style={styles.separator} />
              ) : null}
            </View>
          ))}
        </View>
      )}

      <ImageGalleryModal
        images={reviewPhotos}
        visible={selectedPhotoIndex !== null}
        initialIndex={selectedPhotoIndex ?? 0}
        onClose={() => setSelectedPhotoIndex(null)}
      />
    </View>
  );
}
