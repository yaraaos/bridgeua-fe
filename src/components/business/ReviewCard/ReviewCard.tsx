import ImageGalleryModal from "@/src/components/common/ImageGalleryModal/ImageGalleryModal";
import AppAvatar from "@/src/components/ui/AppAvatar";
import { colors } from "@/src/constants/colors";
import type { BusinessDetailsReview } from "@/src/features/businesses/types/business.types";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "./ReviewCard.styles";

type Props = {
  review: BusinessDetailsReview;
  variant?: "default" | "preview";
};

export default function ReviewCard({ review, variant = "default" }: Props) {
  const isPreview = variant === "preview";
  const showPhotos = !isPreview && !!review.photos?.length;

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );

  return (
    <View style={[styles.container, isPreview && styles.containerPreview]}>
      <View style={styles.header}>
        <AppAvatar
          name={review.authorName}
          imageUrl={review.authorAvatar}
          size={isPreview ? "sm" : "md"}
        />

        <View style={styles.authorInfo}>
          <Text
            style={[styles.authorName, isPreview && styles.authorNamePreview]}
            numberOfLines={1}
          >
            {review.authorName}
          </Text>

          <View style={styles.starsRow}>
            {Array.from({ length: 5 }).map((_, index) => {
              const isFilled = index < Math.round(review.rating);

              return (
                <MaterialIcons
                  key={index}
                  name={isFilled ? "star" : "star-border"}
                  size={isPreview ? 11 : 14}
                  color={colors.primaryGreen}
                />
              );
            })}
          </View>
        </View>
      </View>

      <Text
        style={[styles.text, isPreview && styles.textPreview]}
        numberOfLines={isPreview ? 4 : 3}
      >
        {review.text}
      </Text>

      {showPhotos ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photosScroll}
        >
          {review.photos?.map((photo, index) => (
            <Pressable
              key={photo.id}
              onPress={() => setSelectedPhotoIndex(index)}
              style={styles.photoItem}
            >
              <Image source={{ uri: photo.url }} style={styles.reviewPhoto} />
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      {isPreview ? <Text style={styles.moreText}>More</Text> : null}

      <ImageGalleryModal
        images={review.photos ?? []}
        visible={selectedPhotoIndex !== null}
        initialIndex={selectedPhotoIndex ?? 0}
        onClose={() => setSelectedPhotoIndex(null)}
      />
    </View>
  );
}
