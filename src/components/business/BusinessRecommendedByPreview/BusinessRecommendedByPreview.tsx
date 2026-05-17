import type { BusinessRecommendation } from "@/src/features/businesses/types/business.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Pressable, Text, View } from "react-native";
import RecommendedByCard from "../RecommendedByCard";
import { createStyles } from "./BusinessRecommendedByPreview.styles";

type Props = {
  recommendations?: BusinessRecommendation[];
  onPressViewAll?: () => void;
  onPressRecommendation?: (recommendation: BusinessRecommendation) => void;
};

const PREVIEW_LIMIT = 3;

export default function BusinessRecommendedByPreview({
  recommendations = [],
  onPressViewAll,
  onPressRecommendation,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  if (recommendations.length < 1) {
    return null;
  }

  const previewItems = recommendations.slice(0, PREVIEW_LIMIT);
  const shouldShowViewAll = recommendations.length > PREVIEW_LIMIT;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Recommended by</Text>

        {shouldShowViewAll ? (
          <Pressable onPress={onPressViewAll} hitSlop={8}>
            <Text style={styles.viewAllText}>View all &gt;</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.actions}>
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
