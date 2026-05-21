import AppAvatar from "@/src/components/ui/AppAvatar";
import type { BusinessDetailsReview } from "@/src/features/businesses/types/business.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useProfileStore } from "@/src/store/profile.store";
import { useReviewsStore } from "@/src/store/reviews.store";
import type { PersonalProfileReview } from "@/src/types/profile";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  GestureResponderEvent,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { createStyles } from "./ReviewCard.styles";

type Props =
  | {
      review: BusinessDetailsReview;
      variant?: "default" | "preview";
      onPressMore?: (reviewId: string) => void;
      onExpandReview?: (reviewId: string) => void;
      onPressComment?: (reviewId: string) => void;
      onEditReview?: never;
      onDeleteReview?: never;
      isActionMenuOpen?: never;
      onToggleActionMenu?: never;
      onCloseActionMenu?: never;
    }
  | {
      review: PersonalProfileReview;
      variant: "profile";
      onPressMore?: never;
      onExpandReview?: (reviewId: string) => void;
      onPressComment?: (reviewId: string) => void;
      onEditReview?: (review: PersonalProfileReview) => void;
      onDeleteReview?: (review: PersonalProfileReview) => void;
      isActionMenuOpen?: boolean;
      onToggleActionMenu?: (reviewId: string) => void;
      onCloseActionMenu?: () => void;
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
  onExpandReview,
  onEditReview,
  onDeleteReview,
  isActionMenuOpen = false,
  onToggleActionMenu,
  onCloseActionMenu,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const isProfile = variant === "profile";
  const isPreview = variant === "preview";

  const profileReview = isProfileReview(review) ? review : null;
  const businessReview = isBusinessReview(review) ? review : null;

  const profile = useProfileStore((state) => state.profile);

  const isOwnReview =
    businessReview?.authorUsername === profile.username ||
    businessReview?.authorUsername === profile.username;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(review.likedByMe ?? false);
  const [likesCount, setLikesCount] = useState(review.likesCount ?? 0);

  const [commentsCount, setCommentsCount] = useState(review.commentsCount ?? 0);

  const submittedReviews = useReviewsStore((state) => state.submittedReviews);

  const toggleReviewLike = useReviewsStore((state) => state.toggleReviewLike);

  const hasReviewText = !!review.text?.trim();

  const shouldShowReadMore =
    !isPreview && hasReviewText && review.text.length > 120;

  const showPhotos = !isPreview && !!review.photos?.length;

  const openReviewPhotoViewer = (index: number) => {
    router.push({
      pathname: "/modal/image-viewer",
      params: {
        images: JSON.stringify(
          (review.photos ?? []).map((photo) => ({
            id: photo.id,
            url: photo.url,
          })),
        ),
        initialIndex: String(index),
      },
    });
  };

  const handlePressActions = (event: GestureResponderEvent) => {
    event.stopPropagation();
    if (!profileReview) return;
    onToggleActionMenu?.(profileReview.id);
  };

  const handleEditReview = (event: GestureResponderEvent) => {
    event.stopPropagation();

    if (!profileReview) return;

    onCloseActionMenu?.();
    onEditReview?.(profileReview);
  };

  const handleDeleteReview = (event: GestureResponderEvent) => {
    event.stopPropagation();

    if (!profileReview) return;

    onCloseActionMenu?.();
    onDeleteReview?.(profileReview);
  };

  const handleToggleLike = (event: GestureResponderEvent) => {
    event.stopPropagation();

    setIsLiked((currentValue) => !currentValue);
    setLikesCount((currentCount) =>
      isLiked ? Math.max(0, currentCount - 1) : currentCount + 1,
    );

    toggleReviewLike(review.id);
  };

  useEffect(() => {
    const updatedReview = submittedReviews.find(
      (submittedReview) => submittedReview.id === review.id,
    );

    if (!updatedReview) return;

    setCommentsCount(updatedReview.commentsCount ?? 0);
  }, [submittedReviews, review.id]);

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
        isActionMenuOpen && styles.containerMenuOpen,
      ]}
      onPress={handlePressCard}
    >
      {isProfile && profileReview ? (
        <>
          <View style={styles.reviewContent}>
            <View style={styles.profileHeader}>
              <View style={styles.profileBusinessInfo}>
                <Text style={styles.profileBusinessName} numberOfLines={1}>
                  {profileReview.businessName}
                </Text>

                <View style={styles.profileRatingDateRow}>
                  <View style={styles.starsRow}>
                    {Array.from({ length: 5 }).map((_, index) => {
                      const isFilled = index < Math.round(profileReview.rating);

                      return (
                        <MaterialIcons
                          key={index}
                          name={isFilled ? "star" : "star-border"}
                          size={14}
                          color={colors.accentOrange}
                        />
                      );
                    })}
                  </View>

                  {review.isEdited ? (
                    <Text style={styles.profileReviewDate}>Edited</Text>
                  ) : null}

                  <Text style={styles.profileReviewDate}>
                    {new Date(profileReview.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.profileActionsWrap}>
                <Pressable
                  style={[
                    styles.profileActionsButton,
                    isActionMenuOpen && styles.profileActionsButtonActive,
                  ]}
                  onPress={handlePressActions}
                  hitSlop={8}
                >
                  <MaterialIcons
                    name="more-horiz"
                    size={22}
                    color={colors.primaryGreen}
                  />
                </Pressable>

                {isActionMenuOpen ? (
                  <View style={styles.profileActionsMenu}>
                    <Pressable
                      style={styles.profileActionsMenuItem}
                      onPress={handleEditReview}
                    >
                      <MaterialIcons
                        name="edit"
                        size={16}
                        color={colors.primaryGreen}
                      />
                      <Text style={styles.profileActionsMenuText}>
                        Edit review
                      </Text>
                    </Pressable>

                    <Pressable
                      style={styles.profileActionsMenuItem}
                      onPress={handleDeleteReview}
                    >
                      <MaterialIcons
                        name="delete-outline"
                        size={16}
                        color={colors.error}
                      />
                      <Text
                        style={[
                          styles.profileActionsMenuText,
                          { color: colors.error },
                        ]}
                      >
                        Delete review
                      </Text>
                    </Pressable>
                  </View>
                ) : null}
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
                    onPress={() => {
                      setIsExpanded((value) => {
                        const nextValue = !value;

                        if (nextValue) {
                          onExpandReview?.(review.id);
                        }

                        return nextValue;
                      });
                    }}
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
            <View style={styles.interactionRow}>
              <Pressable
                style={styles.interactionButton}
                onPress={handleToggleLike}
              >
                <MaterialIcons
                  name={isLiked ? "thumb-up" : "thumb-up-off-alt"}
                  size={16}
                  color={isLiked ? colors.primaryGreen : colors.textSecondary}
                />

                <Text
                  style={[
                    styles.interactionText,
                    isLiked && styles.interactionTextActive,
                  ]}
                >
                  {likesCount}{" "}
                </Text>
              </Pressable>

              <Pressable
                style={styles.interactionButton}
                onPress={(event) => {
                  event.stopPropagation();

                  if (onPressComment) {
                    onPressComment(review.id);
                    return;
                  }

                  router.push({
                    pathname: "/business/review/[reviewId]",
                    params: {
                      reviewId: review.id,
                    },
                  });
                }}
              >
                <MaterialIcons
                  name="chat-bubble-outline"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={styles.interactionText}>{commentsCount} </Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : businessReview ? (
        <>
          <View style={styles.previewContent}>
            <View style={styles.header}>
              <Pressable
                onPress={() => {
                  if (!businessReview.authorAvatar?.trim()) return;

                  router.push({
                    pathname: "/modal/image-viewer",
                    params: {
                      images: JSON.stringify([
                        {
                          id: "author-avatar",
                          url: businessReview.authorAvatar,
                        },
                      ]),
                      initialIndex: "0",
                    },
                  });
                }}
              >
                <AppAvatar
                  name={businessReview.authorUsername}
                  username={businessReview.authorUsername}
                  imageUrl={
                    isOwnReview
                      ? profile.avatarUrl
                      : businessReview.authorAvatar
                  }
                  size={isPreview ? "sm" : "md"}
                />
              </Pressable>

              <Pressable
                style={styles.authorInfo}
                disabled={!isOwnReview}
                onPress={() => {
                  if (!isOwnReview) return;
                  router.push("/profile/personal");
                }}
              >
                <Text
                  style={[
                    styles.authorName,
                    isPreview && styles.authorNamePreview,
                  ]}
                  numberOfLines={1}
                >
                  {businessReview.authorUsername}
                </Text>

                <View style={styles.starsRow}>
                  {Array.from({ length: 5 }).map((_, index) => {
                    const isFilled = index < Math.round(businessReview.rating);

                    return (
                      <MaterialIcons
                        key={index}
                        name={isFilled ? "star" : "star-border"}
                        size={isPreview ? 11 : 14}
                        color={colors.accentOrange}
                      />
                    );
                  })}
                </View>
              </Pressable>

              <Text style={styles.reviewDate}></Text>

              {!isPreview ? (
                <>
                  {review.isEdited ? (
                    <Text style={styles.reviewDate}>Edited</Text>
                  ) : null}

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
                </>
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
                onPress={() => {
                  setIsExpanded((value) => {
                    const nextValue = !value;

                    if (nextValue) {
                      onExpandReview?.(review.id);
                    }

                    return nextValue;
                  });
                }}
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
            <View style={styles.interactionRow}>
              <Pressable
                style={styles.interactionButton}
                onPress={handleToggleLike}
              >
                <MaterialIcons
                  name={isLiked ? "thumb-up" : "thumb-up-off-alt"}
                  size={16}
                  color={isLiked ? colors.primaryGreen : colors.textSecondary}
                />

                <Text
                  style={[
                    styles.interactionText,
                    isLiked && styles.interactionTextActive,
                  ]}
                >
                  {likesCount}
                </Text>
              </Pressable>

              <Pressable
                style={styles.interactionButton}
                onPress={(event) => {
                  event.stopPropagation();

                  if (onPressComment) {
                    onPressComment(review.id);
                    return;
                  }

                  router.push({
                    pathname: "/business/review/[reviewId]",
                    params: {
                      reviewId: review.id,
                    },
                  });
                }}
              >
                <MaterialIcons
                  name="chat-bubble-outline"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={styles.interactionText}>{commentsCount} </Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : null}
    </Pressable>
  );
}
