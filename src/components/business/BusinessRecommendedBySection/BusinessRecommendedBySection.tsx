import type { BusinessRecommendation } from "@/src/features/businesses/types/business.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Image, Pressable, Text, View } from "react-native";
import { createStyles } from "./BusinessRecommendedBySection.styles";

type Props = {
  recommendedBy?: BusinessRecommendation[];
  onPressSeeAll?: () => void;
};

export default function BusinessRecommendedBySection({
  recommendedBy,
  onPressSeeAll,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  if (!recommendedBy?.length) return null;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Recommends</Text>

        {onPressSeeAll ? (
          <Pressable onPress={onPressSeeAll}>
            <Text style={styles.seeAllText}>See all</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.list}>
        {recommendedBy.map((item) => (
          <View key={item.id} style={styles.item}>
            {item.businessImageUrl ? (
              <Image
                source={{ uri: item.businessImageUrl }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarFallbackText}>
                  {item.businessName.charAt(0)}
                </Text>
              </View>
            )}

            <View style={styles.textWrap}>
              <Text style={styles.name}>{item.businessName}</Text>

              <Text style={styles.subtitle}>
                {item.businessCategory}
                {item.businessLocation ? ` · ${item.businessLocation}` : ""}
              </Text>

              {item.recommendationsCount ? (
                <Text style={styles.meta}>
                  {item.recommendationsCount} recommendations made
                </Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}