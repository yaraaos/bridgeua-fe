import ReviewCard from "@/src/components/business/ReviewCard";
import ReviewCommentCard from "@/src/components/reviews/ReviewCommentCard";
import ReviewCommentComposer from "@/src/components/reviews/ReviewCommentComposer";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { getReviewById } from "@/src/features/reviews/services/review.service";
import { useReviewCommentsStore } from "@/src/features/reviews/store/review-comments.store";
import { ReviewComment } from "@/src/features/reviews/types/review-comment.types";
import type { Review } from "@/src/features/reviews/types/review.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ReviewThreadScreen() {
  const { colors } = useAppTheme();
  const { reviewId } = useLocalSearchParams<{ reviewId: string }>();

  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyingToComment, setReplyingToComment] =
    useState<ReviewComment | null>(null);
  const comments = useReviewCommentsStore((state) => state.comments);
  const addComment = useReviewCommentsStore((state) => state.addComment);

  const reviewComments = useMemo(() => {
    if (!reviewId) return [];

    return comments
      .filter((comment) => comment.reviewId === reviewId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }, [comments, reviewId]);

  useEffect(() => {
    const loadReview = async () => {
      if (!reviewId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const data = await getReviewById(reviewId);

      setReview(data);
      setIsLoading(false);
    };

    loadReview();
  }, [reviewId]);

  const handleAddComment = (text: string) => {
    if (!reviewId) return;

    addComment({
      reviewId,
      parentCommentId: replyingToComment?.id,
      text,
    });

    setReplyingToComment(null);
  };

  return (
    <AppScreen style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons
            name="arrow-back-ios-new"
            size={20}
            color={colors.textPrimary}
          />
        </Pressable>

        <View style={styles.headerTextWrap}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Review
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Thread
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <AppLoader />
        </View>
      ) : review ? (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <ReviewCard review={review} />

            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Comments
            </Text>

            {reviewComments.length > 0 ? (
              reviewComments.map((comment) => (
                <ReviewCommentCard
                  key={comment.id}
                  comment={comment}
                  onReply={setReplyingToComment}
                />
              ))
            ) : (
              <AppEmptyState
                title="No comments yet"
                description="Start the conversation around this review."
              />
            )}
          </ScrollView>

          {replyingToComment ? (
            <View style={[styles.replyBanner, { borderColor: colors.border }]}>
              <Text
                style={[
                  styles.replyBannerText,
                  { color: colors.textSecondary },
                ]}
              >
                Replying to @{replyingToComment.author.username}
              </Text>

              <Pressable onPress={() => setReplyingToComment(null)} hitSlop={8}>
                <MaterialIcons
                  name="close"
                  size={18}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>
          ) : null}

          <ReviewCommentComposer onSubmit={handleAddComment} />
        </>
      ) : (
        <AppEmptyState
          title="Review not found"
          description="This review may have been removed."
        />
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  header: {
    minHeight: 64,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
  },
  loaderWrap: {
    flex: 1,
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "800",
  },
  replyBanner: {
    minHeight: 42,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  replyBannerText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
