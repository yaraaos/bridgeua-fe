import AppAvatar from "@/src/components/ui/AppAvatar";
import type { BusinessRecommendation } from "@/src/features/businesses/types/business.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { createStyles } from "./RecommendedByCard.styles";

type Props = {
  recommendation: BusinessRecommendation;
  isBordered?: boolean;
  onPress?: (recommendation: BusinessRecommendation) => void;
};

export default function RecommendedByCard({
  recommendation,
  isBordered = false,
  onPress,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      style={[styles.container, isBordered ? styles.bordered : null]}
      onPress={() => onPress?.(recommendation)}
    >
      <AppAvatar
        imageUrl={recommendation.businessImageUrl}
        name={recommendation.businessName}
        size="md"
      />

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {recommendation.businessName}
        </Text>

        <View style={styles.metaRow}>
          <Ionicons name="star" size={12} color={colors.accentOrange} />
          <Text style={styles.meta} numberOfLines={1}>
            {recommendation.businessCategory}
            {recommendation.businessLocation
              ? ` • ${recommendation.businessLocation}`
              : ""}
          </Text>
        </View>

        <View style={styles.recommendedRow}>
          <Text style={styles.recommendedLabel} numberOfLines={1}>
            Recommended by{" "}
            {recommendation.recommendedByPreview?.[0] ??
              recommendation.businessName ??
              "community"}
          </Text>

          {(recommendation.recommendedByCount ?? 0) > 0 ? (
            <Text style={styles.recommendedCount} numberOfLines={1}>
              +{recommendation.recommendedByCount}
            </Text>
          ) : null}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}
