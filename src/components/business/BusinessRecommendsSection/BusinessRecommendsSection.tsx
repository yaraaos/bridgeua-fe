import type { BusinessRecommendation } from "@/src/features/businesses/types/business.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import RecommendedByCard from "../RecommendedByCard";
import { createStyles } from "./BusinessRecommendsSection.styles";

type Props = {
  recommends?: BusinessRecommendation[];
  onPressSeeAll?: () => void;
  onPressRecommendation?: (recommendation: BusinessRecommendation) => void;
};

const PREVIEW_LIMIT = 3;

export default function BusinessRecommendsSection({
  recommends = [],
  onPressSeeAll,
  onPressRecommendation,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  if (recommends.length < 1) {
    return null;
  }

  const previewItems = recommends.slice(0, PREVIEW_LIMIT);
  const shouldShowSeeAll = recommends.length > PREVIEW_LIMIT;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Recommends</Text>

        {shouldShowSeeAll ? (
          <Pressable style={styles.viewAllButton} onPress={onPressSeeAll}>
            <Text style={styles.viewAllText}>View all</Text>
            <Ionicons
              name="chevron-forward"
              size={14}
              style={styles.viewAllIcon}
            />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.list}>
        {previewItems.map((recommendation, index) => (
          <RecommendedByCard
            key={recommendation.id}
            recommendation={recommendation}
            isBordered={index !== 0}
            onPress={onPressRecommendation}
          />
        ))}
      </View>
    </View>
  );
}
