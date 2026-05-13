import AppAvatar from "@/src/components/ui/AppAvatar";
import type { BusinessDetailsReview } from "@/src/features/businesses/types/business.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import type { PersonalProfileReview } from "@/src/types/profile";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { createStyles } from "./ReviewCard.styles";

type Props =
  | {
      review: BusinessDetailsReview;
      variant?: "default" | "preview";
      onPressMore?: (reviewId: string) => void;
    }
  | {
      review: PersonalProfileReview;
      variant: "profile";
      onPressMore?: never;
    };

function isProfileReview(
  review: BusinessDetailsReview | PersonalProfileReview,
): review is PersonalProfileReview {
  return "businessName" in review;
}

function isBusinessReview(
  review: BusinessDetailsReview | PersonalProfileReview,
): review is BusinessDetailsReview {
  return "authorName" in review;
}

export default function ReviewCard({
  review,
  variant = "default",
  onPressMore,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const isProfile = variant === "profile";
  const isPreview = variant === "preview";

  const profileReview = isProfileReview(review) ? review : null;
  const businessReview = isBusinessReview(review) ? review : null;

  const [isExpanded, setIsExpanded] = useState(false);

  const hasReviewText = !!review.text?.trim();

  const shouldShowReadMore =
    !isPreview && hasReviewText && review.text.length > 120;

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

  const handlePressCard = () => {
    if (!profileReview) return;

    router.push({
      pathname: "/business/[id]",
      params: {
        id: profileReview.businessId,
        tab: "reviews",
        focusedReviewId: profileReview.id,
      },
    });
  };

  return (
    <Pressable
      disabled={!isProfile}
      style={[
        styles.container,
        isPreview && styles.containerPreview,
        isProfile && styles.reviewCard,
      ]}
      onPress={handlePressCard}
    >
      {isProfile && profileReview ? (
        <>
          <View style={styles.reviewContent}>
            <View style={styles.profileHeader}>
              <View style={styles.profileBusinessImageWrap}>
                <Image
                  source={{ uri: profileReview.businessImageUrl }}
                  style={styles.profileBusinessImage}
                />
              </View>

              <View style={styles.profileBusinessInfo}>
                <Text style={styles.profileBusinessName} numberOfLines={1}>
                  {profileReview.businessName}
                </Text>

                <View style={styles.starsRow}>
                  {Array.from({ length: 5 }).map((_, index) => {
                    const isFilled = index < Math.round(profileReview.rating);

                    return (
                      <MaterialIcons
                        key={index}
                        name={isFilled ? "star" : "star-border"}
                        size={14}
                        color={colors.primaryGreen}
                      />
                    );
                  })}
                </View>
              </View>
            </View>

            {hasReviewText ? (
              <>
                <Text
                  style={styles.text}
                  numberOfLines={isExpanded ? undefined : 3}
                >
                  {profileReview.text}
                </Text>

                {shouldShowReadMore ? (
                  <Pressable
                    style={styles.moreButton}
                    onPress={() => setIsExpanded((value) => !value)}
                  >
                    <Text style={styles.moreText}>
                      {isExpanded ? "Show less" : "Read more"}
                    </Text>
                  </Pressable>
                ) : null}
              </>
            ) : null}

            {showPhotos ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.reviewPhotosScroll}
              >
                {profileReview.photos?.map((photo, index) => (
                  <Pressable
                    key={photo.id}
                    onPress={() => openReviewPhotoViewer(index)}
                  >
                    <Image
                      source={{ uri: photo.url }}
                      style={styles.reviewPhotoPreview}
                    />
                  </Pressable>
                ))}
              </ScrollView>
            ) : null}
          </View>

          <View style={styles.reviewRight}>
            <View style={styles.reviewDateWrap}>
              <Text style={styles.reviewDate}>
                {new Date(profileReview.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>
        </>
      ) : businessReview ? (
        <>
          <View style={styles.header}>
            <AppAvatar
              name={businessReview.authorName}
              imageUrl={businessReview.authorAvatar}
              size={isPreview ? "sm" : "md"}
            />

            <View style={styles.authorInfo}>
              <Text
                style={[
                  styles.authorName,
                  isPreview && styles.authorNamePreview,
                ]}
                numberOfLines={1}
              >
                {businessReview.authorName}
              </Text>

              <View style={styles.starsRow}>
                {Array.from({ length: 5 }).map((_, index) => {
                  const isFilled = index < Math.round(businessReview.rating);

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

            {!isPreview ? (
              <Text style={styles.reviewDate}>
                {new Date(businessReview.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                )}
              </Text>
            ) : null}
          </View>

          {hasReviewText ? (
            <Text
              style={[styles.text, isPreview && styles.textPreview]}
              numberOfLines={isPreview ? 4 : isExpanded ? undefined : 3}
            >
              {businessReview.text}
            </Text>
          ) : null}

          {isPreview ? (
            <Pressable
              style={styles.moreButton}
              onPress={() => onPressMore?.(businessReview.id)}
            >
              <Text style={styles.moreText}>More</Text>
            </Pressable>
          ) : shouldShowReadMore ? (
            <Pressable
              style={styles.moreButton}
              onPress={() => setIsExpanded((value) => !value)}
            >
              <Text style={styles.moreText}>
                {isExpanded ? "Show less" : "Read more"}
              </Text>
            </Pressable>
          ) : null}

          {showPhotos ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photosScroll}
            >
              {businessReview.photos?.map((photo, index) => (
                <Pressable
                  key={photo.id}
                  onPress={() => openReviewPhotoViewer(index)}
                  style={styles.photoItem}
                >
                  <Image
                    source={{ uri: photo.url }}
                    style={styles.reviewPhoto}
                  />
                </Pressable>
              ))}
            </ScrollView>
          ) : null}

          {!isPreview && businessReview.tags?.length ? (
            <View style={styles.tagsWrap}>
              {businessReview.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </>
      ) : null}
    </Pressable>
  );
}
