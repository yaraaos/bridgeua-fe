import { colors } from "@/src/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";
import { SCREEN_WIDTH, styles, SVG_WIDTH } from "./splash.styles";

const LEFT_PATH =
  "M8.733 0.113c-1.291 0.292-2.452 1.058-3.218 2.123-0.425 0.592-0.64 1.030-0.821 1.675-0.297 1.060-0.314 1.902-0.060 2.955 0.283 1.172 1.133 2.402 2.14 3.098 1.12 0.774 2.386 1.113 3.691 0.986 1.67-0.162 3.051-0.988 4.028-2.409 1.471-2.141 1.178-5.115-0.687-6.972-0.751-0.747-1.635-1.235-2.641-1.458-0.672-0.149-1.768-0.148-2.431 0.002zM41.526 8.847c-2.246 0.043-5.974 0.295-7.971 0.54-0.255 0.031-0.803 0.097-1.217 0.147-5.371 0.643-11.366 2.042-15.565 3.634-4.806 1.821-8.337 3.956-11.009 6.655-2.587 2.614-4.341 5.707-5.257 9.274-0.239 0.929-0.563 2.789-0.498 2.855 0.025 0.025 3.017 0.039 6.649 0.031l6.603-0.015 0.306-0.841c1.309-3.593 3.283-6.69 5.986-9.394 0.946-0.946 1.514-1.458 2.313-2.084 4.13-3.235 9.404-5.422 15.023-6.228 1.931-0.277 3.976-0.436 5.634-0.438 0.479-0.001 0.691-0.022 0.723-0.073 0.050-0.080 0.038-3.967-0.013-4.050-0.018-0.028-0.246-0.046-0.507-0.039s-0.801 0.019-1.199 0.026z";

const EASING = Easing.bezier(0.4, 0, 0.2, 1);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function SplashScreen() {
  const leftX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const rightX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(8)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(leftX, {
          toValue: 0,
          duration: 900,
          easing: EASING,
          useNativeDriver: true,
        }),
        Animated.timing(rightX, {
          toValue: 0,
          duration: 900,
          easing: EASING,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        delay: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.replace("/onboarding");
    });
  }, []);

  return (
    <AnimatedLinearGradient
      colors={["#2b803a32", "#FFFFFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, { opacity: screenOpacity }]}
    >
      <View style={styles.logoWrap}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { transform: [{ translateX: leftX }] },
          ]}
        >
          <Svg
            width={SVG_WIDTH}
            height={210}
            viewBox="0 0 43 32"
            style={{ backgroundColor: "transparent" }}
          >
            <Path d={LEFT_PATH} fill={colors.primaryGreen} />
          </Svg>
        </Animated.View>

        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { transform: [{ translateX: rightX }] },
          ]}
        >
          <Svg
            width={SVG_WIDTH}
            height={210}
            viewBox="0 0 43 32"
            style={{ backgroundColor: "transparent" }}
          >
            <G transform="translate(43,0) scale(-1,1)">
              <Path d={LEFT_PATH} fill={colors.accentOrange} />
            </G>
          </Svg>
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.textWrap,
          { opacity: textOpacity, transform: [{ translateY: textY }] },
        ]}
      >
        <Svg width={290} height={128} viewBox="0 0 190 28">
          <SvgText
            x="70"
            y="18"
            textAnchor="middle"
            fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif"
            fontSize="26"
            fontWeight="700"
            letterSpacing="2"
            fill={colors.primaryGreen}
          >
            Bridge
          </SvgText>
          <SvgText
            x="138"
            y="18"
            textAnchor="middle"
            fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif"
            fontSize="26"
            fontWeight="700"
            letterSpacing="2"
            fill={colors.accentOrange}
          >
            UA
          </SvgText>
        </Svg>
      </Animated.View>
    </AnimatedLinearGradient>
  );
}
