import React from "react";
import { Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/src/hooks/useAppTheme";
import { DISTANCE_OPTIONS } from "@/src/constants/filters";
import type { DistanceOption } from "@/src/store/filter.store";
import { useTranslation } from "react-i18next";
import { createStyles } from "./DistanceSelector.styles";

type Props = {
  value: DistanceOption;
  onChange: (value: DistanceOption) => void;
};

export default function DistanceSelector({ value, onChange }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  return (
    <View>
      <Text style={styles.title}>{t("filterOptions.filterByDistance")}</Text>

      <View style={styles.optionsWrap}>
        {DISTANCE_OPTIONS.map((option) => {
          const active = value === option.value;
          const label = option.value === "nearby" ? t("filterOptions.distanceNearby") : option.label;

          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={styles.optionRow}
            >
              <View
                style={[styles.radioOuter, active && styles.radioOuterActive]}
              >
                {active ? <View style={styles.radioInner} /> : null}
              </View>

              <Text style={styles.optionText}>{label}</Text>
            </Pressable>
          );
        })}

      </View>
    </View>
  );
}