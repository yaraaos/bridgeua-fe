import { Feather } from "@expo/vector-icons";
import { Image, Modal, Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/src/hooks/useAppTheme";
import type { HomePromotion } from "@/src/features/promotions/types/promotion.types";
import { createStyles } from "./HomePromotionModal.styles";

type Props = {
  visible: boolean;
  promotion: HomePromotion | null;
  onClose: () => void;
  onPressCta: (promotion: HomePromotion) => void;
};

export default function HomePromotionModal({
  visible,
  promotion,
  onClose,
  onPressCta,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  if (!promotion) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={16} color={colors.textPrimary} />
          </Pressable>

          <Image source={{ uri: promotion.imageUrl }} style={styles.image} />

          {!!promotion.subtitle && (
            <Text style={styles.subtitle}>{promotion.subtitle}</Text>
          )}

          <Text style={styles.title}>{promotion.title}</Text>

          {!!promotion.description && (
            <Text style={styles.description}>{promotion.description}</Text>
          )}

          <Pressable
            style={styles.ctaButton}
            onPress={() => onPressCta(promotion)}
          >
            <Text style={styles.ctaText}>
              {promotion.ctaLabel ?? `View ${promotion.businessName}`}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}