import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { FlatList, StyleSheet, View, useWindowDimensions } from "react-native";
import OnboardingSlide from "../../src/components/onboarding/OnboardingSlide/OnboardingSlide";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import AppText from "../../src/components/ui/AppText/AppText";
import { colors } from "../../src/constants/colors";
import { ONBOARDING_SLIDES } from "../../src/mocks/onboarding.mock";

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlide = ONBOARDING_SLIDES[activeIndex];
  const isLastSlide = activeIndex === ONBOARDING_SLIDES.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      router.replace("/auth/sign-in");
      return;
    }

    listRef.current?.scrollToIndex({
      index: activeIndex + 1,
      animated: true,
    });
  };

  return (
    <AppScreen style={styles.container}>
      <FlatList
        ref={listRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ width, overflow: "hidden" }}>
            <OnboardingSlide
              slide={item}
              totalSlides={ONBOARDING_SLIDES.length}
              activeIndex={activeIndex}
            />
          </View>
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
      />

      <View style={styles.footer}>
        <View style={styles.textWrap}>
          <AppText style={styles.title}>{activeSlide.title}</AppText>
          <AppText style={styles.subtitle}>{activeSlide.subtitle}</AppText>
        </View>

        <AppButton title={activeSlide.buttonLabel} onPress={handleNext} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingBottom: 32,
  },
  footer: {
    paddingHorizontal: 18,
    paddingBottom: 24,
    gap: 46,
  },

  textWrap: {
    gap: 8,
  },

  title: {
    fontSize: 28,
    lineHeight: 38,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
});
