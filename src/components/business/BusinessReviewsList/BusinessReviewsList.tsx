import ReviewCard from "@/src/components/business/ReviewCard";
import ReviewFilters, {
  type ReviewFilterOption,
} from "@/src/components/business/ReviewFilters/ReviewFilters";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import type {
  BusinessDetailsReview,
  BusinessReviewPhoto,
} from "@/src/features/businesses/types/business.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { createStyles } from "./BusinessReviewsList.styles";

type Props = {
  reviews: BusinessDetailsReview[];
  reviewCount: number;
  reviewPhotos: BusinessReviewPhoto[];
  onPressWriteReview?: (rating?: number) => void;
  focusedReviewId?: string | null;
  onClearFocusedReview?: () => void;
  onReviewsListLayout?: (y: number) => void;
};

export default function BusinessReviewsList({
  reviews,
  reviewCount,
  reviewPhotos,
  focusedReviewId,
  onClearFocusedReview,
  onPressWriteReview,
  onReviewsListLayout,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [activeFilter, setActiveFilter] =
    useState<ReviewFilterOption>("Most relevant");

  const sortedReviews = [...reviews].sort((a, b) => {
    if (activeFilter === "Newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    if (activeFilter === "Highest") {
      return b.rating - a.rating;
    }

    if (activeFilter === "Lowest") {
      return a.rating - b.rating;
    }

    return 0;
  });

  const displayedReviews = focusedReviewId
    ? [
        ...sortedReviews.filter((review) => review.id === focusedReviewId),
        ...sortedReviews.filter((review) => review.id !== focusedReviewId),
      ]
    : sortedReviews;

  const openReviewPhotoViewer = (index: number) => {
    router.push({
      pathname: "/modal/image-viewer",
      params: {
        images: JSON.stringify(
          reviewPhotos.map(({ id, url }) => ({ id, url })),
        ),
        initialIndex: String(index),
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.writeCard}>
        <Text style={styles.writeTitle}>Write a review</Text>

        <View style={styles.writeStars}>
          {Array.from({ length: 5 }).map((_, index) => {
            const rating = index + 1;

            return (
              <Pressable
                key={rating}
                hitSlop={10}
                onPress={() => onPressWriteReview?.(rating)}
              >
                <Ionicons
                  name="star-outline"
                  size={34}
                  style={styles.writeStar}
                />
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.writeHint}>
          Share your experience and help the community.
        </Text>

        <AppButton
          title="Write a review"
          onPress={() => onPressWriteReview?.()}
        />
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
                onPress={() => openReviewPhotoViewer(index)}
                style={styles.photoItem}
              >
                <Image source={{ uri: photo.url }} style={styles.reviewPhoto} />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      <ReviewFilters
        value={activeFilter}
        onChange={(nextFilter) => {
          setActiveFilter(nextFilter);
          onClearFocusedReview?.();
        }}
      />

      <View
        style={styles.listHeader}
        onLayout={(event) => {
          onReviewsListLayout?.(event.nativeEvent.layout.y);
        }}
      >
        <Text style={styles.sectionTitle}>All reviews</Text>
        <Text style={styles.reviewCount}>{reviewCount} total</Text>
      </View>

      {displayedReviews.length === 0 ? (
        <AppEmptyState
          title="No reviews yet"
          description="Be the first to share your experience."
        />
      ) : (
        <View>
          <View style={styles.list}>
            {displayedReviews.map((review, index) => (
              <View key={review.id}>
                <ReviewCard
                  review={review}
                  onPressMore={() => {
                    // TODO: expand review / open modal later
                  }}
                />

                {index < displayedReviews.length - 1 ? (
                  <View style={styles.separator} />
                ) : null}
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
