import React from "react";
import { View } from "react-native";
import { styles } from "./OnboardingDots.styles";

type Props = {
  total: number;
  activeIndex: number;
};

export default function OnboardingDots({ total, activeIndex }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index === activeIndex && styles.activeDot]}
        />
      ))}
    </View>
  );
}
