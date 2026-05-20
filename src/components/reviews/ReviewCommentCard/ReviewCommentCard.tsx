import AppAvatar from "@/src/components/ui/AppAvatar";
import type { ReviewComment } from "@/src/features/reviews/types/review-comment.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  comment: ReviewComment;
};

export default function ReviewCommentCard({ comment }: Props) {
  const { colors } = useAppTheme();
  const isReply = !!comment.parentCommentId;

  return (
    <View style={[styles.container, isReply && styles.replyContainer]}>
      <AppAvatar
        name={comment.author.name}
        username={comment.author.username}
        imageUrl={comment.author.avatarUrl}
        size="sm"
      />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.username, { color: colors.textPrimary }]}>
            {comment.author.username}
          </Text>

          <Text style={[styles.date, { color: colors.textMuted }]}>
            {new Date(comment.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>

        <Text style={[styles.text, { color: colors.textSecondary }]}>
          {comment.text}
        </Text>

        <Text style={[styles.meta, { color: colors.textMuted }]}>
          {comment.likesCount} likes
        </Text>
      </View>
    </View>
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
  meta: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
  },
});
