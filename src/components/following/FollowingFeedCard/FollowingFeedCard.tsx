import FollowButton from "@/src/components/business/FollowButton/FollowButton";
import { RatingBadge } from "@/src/components/common";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./FollowingFeedCard.styles";

type FollowingFeedCardProps = {
  item: any;
};

export default function FollowingFeedCard({ item }: FollowingFeedCardProps) {
  return (
    <Pressable
      style={styles.feedCard}
      onPress={() =>
        router.push({
          pathname: "/business/[id]",
          params: { id: String(item.businessId) },
        })
      }
    >
      <View style={styles.feedCardTop}>
        <Image source={{ uri: item.businessImage }} style={styles.businessImage} />

        <View style={styles.feedCardInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.businessName} numberOfLines={1}>
              {item.businessName}
            </Text>

            <View style={styles.rightActions}>
              <RatingBadge rating={item.businessRating} compact />
              <FollowButton
                businessId={String(item.businessId)}
                size="sm"
                variant="outline"
              />
            </View>
          </View>

          <Text style={styles.metaText} numberOfLines={1}>
            {item.businessCategory}
          </Text>

          <Text style={styles.metaText} numberOfLines={1}>
            {item.businessLocation}
          </Text>

          {!!item.recommendedBy && (
            <Text style={styles.recommendedText} numberOfLines={1}>
              {item.recommendedBy}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.feedBody}>
        <Text style={styles.feedTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.feedDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </Pressable>
  );
}