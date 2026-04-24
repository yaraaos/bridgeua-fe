import { colors } from "@/src/constants/colors";
import type { HomePromotion } from "@/src/features/promotions/types/promotion.types";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef } from "react";
import {
    FlatList,
    ImageBackground,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    Text,
    View,
} from "react-native";

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

const AUTO_SWIPE_INTERVAL_MS = 8000;

export default function HomePromotionBanner({
  promotions,
  visible,
  onClose,
  onPressPromotion,
}: Props) {
  const listRef = useRef<FlatList<HomePromotion>>(null);
  const activeIndexRef = useRef(1);
  const isUserTouchingRef = useRef(false);

  const loopedPromotions = useMemo(() => {
    if (promotions.length <= 1) {
      return promotions;
    }

    return [promotions[promotions.length - 1], ...promotions, promotions[0]];
  }, [promotions]);

  useEffect(() => {
    if (visible && promotions.length > 1) {
      requestAnimationFrame(() => {
        activeIndexRef.current = 1;

        listRef.current?.scrollToIndex({
          index: 1,
          animated: false,
        });
      });
    }
  }, [visible, promotions.length]);

  useEffect(() => {
    if (!visible || promotions.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      if (isUserTouchingRef.current) {
        return;
      }

      const nextIndex = activeIndexRef.current + 1;

      listRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      activeIndexRef.current = nextIndex;
    }, AUTO_SWIPE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [visible, promotions.length]);

  if (!visible || promotions.length === 0) {
    return null;
  }

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (promotions.length <= 1) {
      return;
    }

    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / HOME_PROMOTION_BANNER_WIDTH);

    activeIndexRef.current = index;

    if (index === 0) {
      activeIndexRef.current = promotions.length;

      listRef.current?.scrollToIndex({
        index: promotions.length,
        animated: false,
      });
      return;
    }

    if (index === loopedPromotions.length - 1) {
      activeIndexRef.current = 1;

      listRef.current?.scrollToIndex({
        index: 1,
        animated: false,
      });
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.window}>
        <FlatList
          ref={listRef}
          data={loopedPromotions}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          horizontal
          pagingEnabled
          snapToInterval={HOME_PROMOTION_BANNER_WIDTH}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScrollBeginDrag={() => {
            isUserTouchingRef.current = true;
          }}
          onScrollEndDrag={() => {
            isUserTouchingRef.current = false;
          }}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          getItemLayout={(_, index) => ({
            length: HOME_PROMOTION_BANNER_WIDTH,
            offset: HOME_PROMOTION_BANNER_WIDTH * index,
            index,
          })}
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
