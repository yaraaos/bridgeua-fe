import FollowButton from "@/src/components/business/FollowButton/FollowButton";
import type { FollowingFeedCardItem } from "@/src/features/following/types/following.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { createStyles } from "./FollowingFeedCard.styles";

type FollowingFeedCardProps = {
  item: FollowingFeedCardItem;
};

export default function FollowingFeedCard({ item }: FollowingFeedCardProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      style={styles.feedCard}
      onPress={() =>
        router.push({
          pathname:
            item.type === "promotion" ? "/promotions/[id]" : "/news/[id]",
          params: {
            id:
              item.type === "promotion"
                ? (item.promotionId ?? item.id)
                : (item.newsId ?? item.id),
          },
        })
      }
    >
      <View style={styles.feedHeader}>
        <View style={styles.feedContentRow}>
          <View style={styles.feedIcon}>
            <Ionicons
              name={
                item.type === "promotion"
                  ? "pricetag-outline"
                  : "newspaper-outline"
              }
              size={18}
              color={colors.primaryGreen}
            />
          </View>

          <View style={styles.feedTextWrap}>
            <Text style={styles.feedTitle} numberOfLines={2}>
              {item.title}
            </Text>

            <Text style={styles.feedDescription} numberOfLines={3}>
              {item.description}
            </Text>
          </View>
        </View>

        <FollowButton
          businessId={String(item.businessId)}
          size="icon"
          variant="soft"
        />
      </View>

      <View style={styles.feedBody}>
        <Image
          source={{ uri: item.businessImage }}
          style={styles.businessImage}
        />

        <View style={styles.businessInfo}>
          <Text style={styles.businessName} numberOfLines={1}>
            {item.businessName}
          </Text>

          <View style={styles.businessMetaRow}>
            <Ionicons name="star" size={12} color={colors.accentOrange} />

            <Text style={styles.ratingText}>
              {item.businessRating.toFixed(1)}
            </Text>

            <Text style={styles.dot}>•</Text>

            <Text style={styles.metaText} numberOfLines={1}>
              {item.businessCategory}
            </Text>

            <Text style={styles.dot}>•</Text>

            <Text style={styles.metaText} numberOfLines={1}>
              {item.businessLocation}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
