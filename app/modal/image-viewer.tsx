// app/modal/image-viewer.tsx

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    PanResponder,
    Pressable,
    StyleSheet,
    Text,
    View,
    type ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SWIPE_DOWN_THRESHOLD = 80;

type ImageItem = { id: string; url: string };

export default function ImageViewerScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    images: string;
    initialIndex: string;
    overlayIndex?: string;
    overlayText?: string;
    businessId?: string;
  }>();

  const images: ImageItem[] = params.images ? JSON.parse(params.images) : [];
  const initialIndex = params.initialIndex
    ? parseInt(params.initialIndex, 10)
    : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handleClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) router.back();
    });
  }, [translateY, opacity]);

  const overlayIndex =
    params.overlayIndex !== undefined
      ? Number.parseInt(params.overlayIndex, 10)
      : null;

  const overlayText = params.overlayText ?? "View all";

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 8 &&
        Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
          const progress = Math.min(gestureState.dy / 200, 1);
          opacity.setValue(1 - progress * 0.6);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SWIPE_DOWN_THRESHOLD) {
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: SCREEN_HEIGHT,
              duration: 240,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(({ finished }) => {
            if (finished) router.back();
          });
        } else {
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              bounciness: 4,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  return (
    <Animated.View
      style={[styles.root, { opacity, transform: [{ translateY }] }]}
    >
      {/* Counter */}
      <View style={[styles.counter, { top: insets.top + 16 }]}>
        <Text style={styles.counterText}>
          {currentIndex + 1} / {images.length}
        </Text>
      </View>

      {/* Close button */}
      <Pressable
        style={[styles.closeBtn, { top: insets.top + 12 }]}
        onPress={handleClose}
        hitSlop={12}
      >
        <Ionicons name="close" size={22} color="#FFFFFF" />
      </Pressable>

      {/* Image pager */}
      <View style={styles.pagerWrap} {...panResponder.panHandlers}>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({ item, index }) => {
            const shouldShowOverlay = overlayIndex === index;

            return (
              <Pressable style={styles.page} onPress={handleClose}>
                <Pressable style={styles.imageWrap} onPress={() => {}}>
                  <Image
                    source={{ uri: item.url }}
                    style={styles.image}
                    resizeMode="contain"
                  />

                  {shouldShowOverlay ? (
                    <Pressable
                      style={styles.viewAllOverlay}
                      onPress={() => {
                        if (params.businessId) {
                          router.replace({
                            pathname: "/business/[id]",
                            params: {
                              id: params.businessId,
                              tab: "photos",
                            },
                          });
                          return;
                        }

                        router.back();
                      }}
                    >
                      <Text style={styles.viewAllText}>{overlayText}</Text>
                    </Pressable>
                  ) : null}
                </Pressable>
              </Pressable>
            );
          }}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.94)",
  },
  counter: {
    position: "absolute",
    alignSelf: "center",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 20,
  },
  counterText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  closeBtn: {
    position: "absolute",
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  pagerWrap: {
    flex: 1,
  },
  page: {
    width: SCREEN_WIDTH,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrap: {
    width: SCREEN_WIDTH * 0.92,
    height: SCREEN_HEIGHT * 0.75,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  viewAllOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.42)",
    alignItems: "center",
    justifyContent: "center",
  },

  viewAllText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
