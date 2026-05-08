import AppAvatar from "@/src/components/ui/AppAvatar";
import type { BusinessDetailsReview } from "@/src/features/businesses/types/business.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { createStyles } from "./ReviewCard.styles";

type Props = {
  review: BusinessDetailsReview;
  variant?: "default" | "preview";
  onPressMore?: (reviewId: string) => void;
};

export default function ReviewCard({
  review,
  variant = "default",
  onPressMore,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const isPreview = variant === "preview";
  const showPhotos = !isPreview && !!review.photos?.length;

  const openReviewPhotoViewer = (index: number) => {
    router.push({
      pathname: "/modal/image-viewer",
      params: {
        images: JSON.stringify(
          (review.photos ?? []).map(({ id, url }) => ({ id, url })),
        ),
        initialIndex: String(index),
      },
    });
  };
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
              onPress={() => openReviewPhotoViewer(index)}
              style={styles.photoItem}
            >
              <Image source={{ uri: photo.url }} style={styles.reviewPhoto} />
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      {!isPreview && review.tags?.length ? (
        <View style={styles.tagsWrap}>
          {review.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {isPreview ? (
        <Pressable
          style={styles.moreButton}
          onPress={() => onPressMore?.(review.id)}
        >
          <Text style={styles.moreText}>More</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
