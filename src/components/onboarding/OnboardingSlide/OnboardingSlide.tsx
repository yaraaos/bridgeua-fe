import AppText from "@/src/components/ui/AppText/AppText";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground, View } from "react-native";
import type { OnboardingSlideItem } from "../../../mocks/onboarding.mock";
import OnboardingDots from "../OnboardingDots";
import { styles } from "./OnboardingSlide.styles";

type Props = {
  slide: OnboardingSlideItem;
  totalSlides: number;
  activeIndex: number;
};

export default function OnboardingSlide({
  slide,
  totalSlides,
  activeIndex,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.brandWrap}>
        <AppText style={styles.logo}>BridgeUA</AppText>
        <AppText style={styles.tagline}>Recommendations built on trust</AppText>
      </View>

      <View style={styles.cardsWrap}>
        {slide.cards.map((card) => {
          const isImageCard = card.variant === "image";

          if (isImageCard) {
            return (
              <View key={card.id} style={styles.card}>
                <ImageBackground
                  source={{ uri: card.image }}
                  resizeMode="cover"
                  imageStyle={styles.imageRadius}
                  style={styles.imageBackground}
                >
                  <LinearGradient
                    colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0.2)"]}
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0 }}
                    style={styles.imageOverlay}
                  >
                    <AppText style={styles.cardEyebrow}>{card.eyebrow}</AppText>
                    <AppText style={styles.cardSubtitle}>
                      {card.subtitle}
                    </AppText>
                  </LinearGradient>
                </ImageBackground>
              </View>
            );
          }

          return (
            <View key={card.id} style={[styles.card]}>
              <View style={styles.imageOverlay}>
                <AppText style={styles.cardEyebrow}>{card.eyebrow}</AppText>
                <AppText style={styles.cardSubtitle}>{card.subtitle}</AppText>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.dotsWrap}>
        <OnboardingDots total={totalSlides} activeIndex={activeIndex} />
      </View>
    </View>
  );
}
