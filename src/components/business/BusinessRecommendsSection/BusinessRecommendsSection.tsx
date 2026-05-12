import type { BusinessRecommendation } from "@/src/features/businesses/types/business.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Image, Pressable, Text, View } from "react-native";
import { createStyles } from "./BusinessRecommendsSection.styles";

type Props = {
  recommends?: BusinessRecommendation[];
  onPressSeeAll?: () => void;
};

export default function BusinessRecommendsSection({
  recommends,
  onPressSeeAll,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  if (!recommends?.length) return null;

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
        {recommends.map((item) => (
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
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
