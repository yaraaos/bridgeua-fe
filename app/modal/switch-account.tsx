// app/modal/switch-account.tsx

import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { router } from "expo-router";

import AccountSwitcherSheet from "@/src/components/profile/AccountSwitcherSheet/AccountSwitcherSheet";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const COLLAPSE_THRESHOLD = 40;

export default function SwitchAccountModal() {
  const [isClosing, setIsClosing] = useState(false);

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [backdropOpacity, sheetTranslateY]);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: SCREEN_HEIGHT,
        duration: 240,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) router.back();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, { dy }) => Math.abs(dy) > 5,
      onPanResponderRelease: (_, { dy }) => {
        if (dy > COLLAPSE_THRESHOLD) {
          handleClose();
        }
      },
    }),
  ).current;

  return (
    <View style={styles.root}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sheetContainer,
          { transform: [{ translateY: sheetTranslateY }] },
        ]}
      >
        <View {...panResponder.panHandlers}>
          <AccountSwitcherSheet
            onClose={handleClose}
            onAddBusiness={() => {
              router.push("/profile/businesses");
            }}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "transparent",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.68)",
  },
  sheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});