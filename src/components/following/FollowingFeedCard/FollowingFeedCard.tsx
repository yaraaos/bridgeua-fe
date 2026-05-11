import BusinessCard from "@/src/components/business/BusinessCard/BusinessCard";
import type { FollowingFeedCardItem } from "@/src/features/following/types/following.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { createStyles } from "./FollowingFeedCard.styles";

type FollowingFeedCardProps = {
  item: FollowingFeedCardItem;
};

export default function FollowingFeedCard({ item }: FollowingFeedCardProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const business = {
    id: String(item.businessId),
    name: item.businessName,
    category: item.businessCategory,
    location: item.businessLocation,
    rating: item.businessRating,
    image: item.businessImage,
    distanceKm: item.distanceKm ?? 0,
    priceLevel: item.priceLevel ?? 0,
    recommendedByPreview: item.recommendedByPreview ?? [],
    recommendedByCount: item.recommendedByCount ?? 0,
  };

  return (
    <Pressable style={styles.feedCard}>
      <BusinessCard
        business={business}
        variant="embedded"
        onPress={() =>
          router.push({
            pathname: "/business/[id]",
            params: { id: String(item.businessId) },
          })
        }
      />

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
