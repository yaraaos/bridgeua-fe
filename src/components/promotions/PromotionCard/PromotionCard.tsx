import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppText from "@/src/components/ui/AppText/AppText";
import type { Promotion } from "@/src/features/promotions/types/promotion.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, View } from "react-native";
import { createStyles } from "./PromotionCard.styles";

type Props = {
  promotion: Promotion;
  onPress: () => void;
};

export default function PromotionCard({ promotion, onPress }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: promotion.imageUrl }} style={styles.image} />

      <View style={styles.content}>
        {!!promotion.categoryLabel && (
          <View style={styles.badge}>
            <AppText style={styles.badgeText}>
              {promotion.categoryLabel}
            </AppText>
          </View>
        )}

        <AppText style={styles.title}>{promotion.title}</AppText>

        <AppText style={styles.description} numberOfLines={2}>
          {promotion.description}
        </AppText>

        <View style={styles.businessRow}>
          <Ionicons name="star" size={14} color={colors.accentOrange} />

          <AppText style={styles.businessText}>
            {promotion.business?.name}
          </AppText>
        </View>

        <View style={styles.actions}>
          <AppButton title={promotion.ctaLabel ?? "View"} onPress={onPress} />
        </View>
      </View>
    </Pressable>
  );
}
