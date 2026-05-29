import ReviewCard from "@/src/components/business/ReviewCard";
import ReviewCommentCard from "@/src/components/reviews/ReviewCommentCard";
import ReviewCommentComposer from "@/src/components/reviews/ReviewCommentComposer";
import { ReviewCommentComposerRef } from "@/src/components/reviews/ReviewCommentComposer/ReviewCommentComposer";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { AuthRequiredModal, useRequireAuth } from "@/src/features/auth";
import { useReviewCommentsStore } from "@/src/features/reviews/store/review-comments.store";
import { ReviewComment } from "@/src/features/reviews/types/review-comment.types";
import type { Review } from "@/src/features/reviews/types/review.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import type { ScrollView as ScrollViewType } from "react-native";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ReviewThreadScreen() {
  const { colors } = useAppTheme();
  const { isAuthModalVisible, closeAuthModal, confirmAuthModal, requireAuth } =
    useRequireAuth();
  const { reviewId, reviewData } = useLocalSearchParams<{ reviewId: string; reviewData: string }>();

  const [review, setReview] = useState<Review | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [replyingToComment, setReplyingToComment] = useState<ReviewComment | null>(null);
  const [isReplyingToReview, setIsReplyingToReview] = useState(false);

  const scrollViewRef = useRef<ScrollViewType | null>(null);
  const composerRef = useRef<ReviewCommentComposerRef | null>(null);

  const comments = useReviewCommentsStore((state) => state.comments);
  const addComment = useReviewCommentsStore((state) => state.addComment);
  const loadComments = useReviewCommentsStore((state) => state.loadComments);
  const toggleCommentLike = useReviewCommentsStore((state) => state.toggleCommentLike);
  const deleteComment = useReviewCommentsStore((state) => state.deleteComment);

  const handleDeleteComment = (commentId: string) => {
    if (!review?.businessId || !reviewId) return;
    Alert.alert("Delete comment?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteComment(review.businessId!, reviewId, commentId);
        },
      },
    ]);
  };

  const reviewRootComments = comments
    .filter((c) => c.reviewId === reviewId && !c.parentCommentId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const getReplies = (parentId: string) =>
    comments
      .filter((c) => c.parentCommentId === parentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  useEffect(() => {
    if (!reviewId) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        const parsed = reviewData ? JSON.parse(reviewData) : null;
        setReview(parsed as Review);
        if (parsed?.businessId && reviewId) {
          await loadComments(parsed.businessId, reviewId);
        }
      } catch {
        setReview(null);
      }
      setIsLoading(false);
    };

    void load();
  }, [reviewId, reviewData]);

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((current) => ({
      ...current,
      [commentId]: !current[commentId],
    }));
  };

  const handleAddComment = (text: string) => {
    requireAuth(
      () => {
        if (!reviewId || !review?.businessId) return;

        const parentCommentId = replyingToComment?.id;

        addComment({
          businessId: review.businessId,
          reviewId,
          parentCommentId,
          text,
        });

        if (parentCommentId) {
          setExpandedReplies((current) => ({
            ...current,
            [parentCommentId]: true,
          }));
        }

        setReplyingToComment(null);
        setIsReplyingToReview(false);

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      },
      { action: "comment" },
    );
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
          <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={0}
          >
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <ReviewCard
                review={review}
                onPressReview={() => {}}
                onPressComment={() => {
                  setReplyingToComment(null);
                  setIsReplyingToReview(true);
                  requestAnimationFrame(() => {
                    composerRef.current?.focus();
                  });
                }}
              />
              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Comments
              </Text>

              {reviewRootComments.length > 0 ? (
                reviewRootComments.map((comment) => {
                  const replies = getReplies(comment.id);
                  return (
                    <View key={comment.id}>
                      <ReviewCommentCard
                        comment={comment}
                        onReply={(c) => {
                          setIsReplyingToReview(false);
                          setReplyingToComment(c);
                          requestAnimationFrame(() => {
                            composerRef.current?.focus();
                          });
                        }}
                        onToggleLike={toggleCommentLike}
                        onDelete={handleDeleteComment}
                      />
                      {replies.length > 0 ? (
                        <>
                          <Pressable
                            style={styles.repliesToggle}
                            onPress={() => toggleReplies(comment.id)}
                          >
                            <Text style={[styles.repliesToggleText, { color: colors.primaryGreen }]}>
                              {expandedReplies[comment.id]
                                ? "Hide replies"
                                : `View ${replies.length} repl${replies.length === 1 ? "y" : "ies"}`}
                            </Text>
                          </Pressable>
                          {expandedReplies[comment.id]
                            ? replies.map((reply) => (
                                <ReviewCommentCard
                                  key={reply.id}
                                  comment={reply}
                                  onReply={(c) => {
                                    setIsReplyingToReview(false);
                                    setReplyingToComment(c);
                                    requestAnimationFrame(() => {
                                      composerRef.current?.focus();
                                    });
                                  }}
                                  onToggleLike={toggleCommentLike}
                                  onDelete={handleDeleteComment}
                                />
                              ))
                            : null}
                        </>
                      ) : null}
                      <View style={[styles.commentGroupDivider, { backgroundColor: colors.border }]} />
                    </View>
                  );
                })
              ) : (
                <AppEmptyState
                  title="No comments yet"
                  description="Start the conversation around this review."
                />
              )}
            </ScrollView>

            {replyingToComment || isReplyingToReview ? (
              <View style={[styles.replyBanner, { borderColor: colors.border }]}>
                <Text style={[styles.replyBannerText, { color: colors.textSecondary }]}>
                  Replying to @
                  {replyingToComment?.author.username ??
                    review.authorUsername ??
                    review.authorName}
                </Text>
                <Pressable
                  onPress={() => {
                    setReplyingToComment(null);
                    setIsReplyingToReview(false);
                  }}
                  hitSlop={8}
                >
                  <MaterialIcons name="close" size={18} color={colors.textSecondary} />
                </Pressable>
              </View>
            ) : null}

            <ReviewCommentComposer
              ref={composerRef}
              onSubmit={handleAddComment}
            />
          </KeyboardAvoidingView>
        </>
      ) : (
        <AppEmptyState
          title="Review not found"
          description="This review may have been removed."
        />
      )}
      <AuthRequiredModal
        visible={isAuthModalVisible}
        onClose={closeAuthModal}
        onConfirm={confirmAuthModal}
      />
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
  repliesToggle: {
    marginLeft: 52,
    marginTop: -2,
    marginBottom: 4,
  },
  repliesToggleText: {
    fontSize: 12,
    fontWeight: "700",
  },
  commentGroupDivider: {
    height: 1,
    marginTop: 4,
  },
  keyboardContainer: {
    flex: 1,
  },
});
