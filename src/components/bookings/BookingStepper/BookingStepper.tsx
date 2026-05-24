import AppText from "@/src/components/ui/AppText/AppText";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import React from "react";
import { View } from "react-native";
import { createStyles } from "./BookingStepper.styles";

type Props = {
  currentStep: number;
  totalSteps?: number;
};

export default function BookingStepper({ currentStep, totalSteps = 5 }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <AppText style={styles.label}>Booking</AppText>
        <AppText style={styles.stepText}>
          Step {currentStep} of {totalSteps}
        </AppText>
      </View>

      <View style={styles.track}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          const isActive = step <= currentStep;

          return (
            <View
              key={step}
              style={[styles.segment, isActive && styles.segmentActive]}
            />
          );
        })}
      </View>
    </View>
  );
}
