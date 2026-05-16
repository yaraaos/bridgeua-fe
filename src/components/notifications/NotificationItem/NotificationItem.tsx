import { Feather } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";

import type {
    AppNotification,
    NotificationType,
} from "@/src/features/notifications/types/notification.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { createStyles } from "./NotificationItem.styles";

type Props = {
  item: AppNotification;
  onPress?: (item: AppNotification) => void;
};

const NOTIFICATION_ICON_MAP: Record<
  NotificationType,
  keyof typeof Feather.glyphMap
> = {
  birthday: "gift",
  business_update: "edit-3",
  new_business: "map-pin",
  new_follower: "user-plus",
  new_review: "star",
  profile_suggestion: "clipboard",
  promotion: "tag",
  promotion_expiring: "clock",
  recommendation: "heart",
  recommendation_received: "heart",
  review_upvote: "thumbs-up",
  system_update: "bell",
};

function formatNotificationTime(createdAt: string) {
  const createdTime = new Date(createdAt).getTime();
  const diffMs = Date.now() - createdTime;
  const diffMinutes = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffMinutes < 1) return "Now";
  if (diffMinutes < 60) return `${diffMinutes}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return new Date(createdAt).toLocaleDateString();
}

export default function NotificationItem({ item, onPress }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const iconName = NOTIFICATION_ICON_MAP[item.type];

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        styles.card,
        item.isRead && styles.cardRead,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.iconWrap}>
        <Feather name={iconName} size={19} color={colors.primaryGreen} />

        {!item.isRead ? <View style={styles.unreadDot} /> : null}
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, item.isRead && styles.titleRead]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
        </View>

        <Text
          style={[styles.subtitle, item.isRead && styles.subtitleRead]}
          numberOfLines={2}
        >
          {item.subtitle}
        </Text>
      </View>

      {!!item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
      ) : null}

      <Text style={styles.time}>{formatNotificationTime(item.createdAt)}</Text>
    </Pressable>
  );
}
