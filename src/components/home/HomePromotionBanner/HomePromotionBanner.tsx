import { colors } from "@/src/constants/colors";
import type { HomePromotion } from "@/src/features/promotions/types/promotion.types";
import { Feather } from "@expo/vector-icons";
import { FlatList, ImageBackground, Pressable, Text, View } from "react-native";

import {
  HOME_PROMOTION_BANNER_WIDTH,
  styles,
} from "./HomePromotionBanner.styles";

type Props = {
  promotions: HomePromotion[];
  visible: boolean;
  onClose: () => void;
  onPressPromotion: (promotion: HomePromotion) => void;
};

export default function HomePromotionBanner({
  promotions,
  visible,
  onClose,
  onPressPromotion,
}: Props) {
  if (!visible || promotions.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.window}>
        <FlatList
          data={promotions}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          snapToInterval={HOME_PROMOTION_BANNER_WIDTH}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={styles.slide}
              onPress={() => onPressPromotion(item)}
            >
              <ImageBackground
                source={{ uri: item.imageUrl }}
                style={styles.image}
                imageStyle={styles.imageRadius}
              >
                <View style={styles.overlay} />

                <Pressable style={styles.closeButton} onPress={onClose}>
                  <Feather name="x" size={12} color={colors.textPrimary} />
                </Pressable>

                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Promo</Text>
                </View>

                <View style={styles.content}>
                  <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                  </Text>

                  <Text style={styles.ctaText} numberOfLines={1}>
                    {item.ctaLabel ?? `View ${item.businessName}`}
                  </Text>
                </View>
              </ImageBackground>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}