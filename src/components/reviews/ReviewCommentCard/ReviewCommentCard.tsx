import AppAvatar from "@/src/components/ui/AppAvatar";
import AppLabel from "@/src/components/ui/AppLabel/AppLabel";
import { AuthRequiredModal, useRequireAuth } from "@/src/features/auth";
import type { ReviewComment } from "@/src/features/reviews/types/review-comment.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useProfileStore } from "@/src/store/profile.store";
import { formatRelativeTime } from "@/src/utils/formatRelativeTime";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  comment: ReviewComment;
  onReply: (comment: ReviewComment) => void;
  onToggleLike: (commentId: string) => void;
  onDelete: (commentId: string) => void;
};

export default function ReviewCommentCard({
  comment,
  onReply,
  onToggleLike,
  onDelete,
}: Props) {
  const { colors } = useAppTheme();
  const { isAuthModalVisible, closeAuthModal, confirmAuthModal, requireAuth } =
    useRequireAuth();
  const isReply = !!comment.parentCommentId;
  const profile = useProfileStore((state) => state.profile);
  const isOwnComment = comment.author.username === profile.username;

  const avatarUrl = isOwnComment ? profile.avatarUrl : comment.author.avatarUrl;

  const handleToggleLike = () => {
    requireAuth(() => onToggleLike(comment.id), {
      action: "comment",
    });
  };

  const handleReply = () => {
    requireAuth(() => onReply(comment), {
      action: "comment",
    });
  };

  const handleDelete = () => {
    requireAuth(() => onDelete(comment.id), {
      action: "comment",
    });
  };

  return (
    <>
      <View style={[styles.container, isReply && styles.replyContainer]}>
        <AppAvatar
          name={comment.author.name}
          username={comment.author.username}
          imageUrl={avatarUrl}
          size="sm"
        />

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={[styles.username, { color: colors.textPrimary }]}>
              {comment.author.username}
            </Text>

            {comment.isOwnerReply && <AppLabel label="Owner" variant="owner" />}

            <Text style={[styles.date, { color: colors.textMuted }]}>
              {formatRelativeTime(comment.createdAt)}
            </Text>
          </View>

          <Text style={[styles.text, { color: colors.textSecondary }]}>
            {comment.text}
          </Text>

          <View style={styles.actionsRow}>
            <Pressable
              style={styles.likeButton}
              onPress={handleToggleLike}
              hitSlop={8}
            >
              <MaterialIcons
                name={comment.likedByMe ? "thumb-up" : "thumb-up-off-alt"}
                size={14}
                color={
                  comment.likedByMe ? colors.primaryGreen : colors.textMuted
                }
              />

              <Text
                style={[
                  styles.meta,
                  {
                    color: comment.likedByMe
                      ? colors.primaryGreen
                      : colors.textMuted,
                  },
                ]}
              >
                {comment.likesCount}
              </Text>
            </Pressable>

            <Pressable
              style={styles.likeButton}
              onPress={handleReply}
              hitSlop={8}
            >
              <MaterialIcons
                name="chat-bubble-outline"
                size={14}
                color={colors.textMuted}
              />

              <Text style={[styles.replyText, { color: colors.primaryGreen }]}>
                Reply
              </Text>
            </Pressable>

            {isOwnComment ? (
              <Pressable
                style={styles.likeButton}
                onPress={handleDelete}
                hitSlop={8}
              >
                <MaterialIcons
                  name="delete-outline"
                  size={15}
                  color={colors.textMuted}
                />

                <Text style={[styles.replyText, { color: colors.textMuted }]}>
                  Delete
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>

      <AuthRequiredModal
        visible={isAuthModalVisible}
        onClose={closeAuthModal}
        onConfirm={confirmAuthModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 14,
  },
  replyContainer: {
    marginLeft: 36,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    fontSize: 13,
    fontWeight: "800",
  },
  date: {
    fontSize: 11,
    fontWeight: "600",
  },
  text: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
  },
  actionsRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  meta: {
    fontSize: 12,
    fontWeight: "700",
  },
  replyText: {
    fontSize: 12,
    fontWeight: "800",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
