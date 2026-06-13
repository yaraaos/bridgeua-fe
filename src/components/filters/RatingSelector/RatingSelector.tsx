import React from "react";
import { Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/src/hooks/useAppTheme";
import { RATING_OPTIONS } from "@/src/constants/filters";
import type { RatingOption } from "@/src/store/filter.store";
import { useTranslation } from "react-i18next";
import { createStyles } from "./RatingSelector.styles";

type Props = {
  value: RatingOption;
  onChange: (value: RatingOption) => void;
};

export default function RatingSelector({ value, onChange }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  return (
    <View>
      <Text style={styles.title}>{t("filterOptions.filterByRating")}</Text>

      <View style={styles.optionsWrap}>
        {RATING_OPTIONS.map((option) => {
          const active = value === option.value;
          const label = option.value === "" ? t("filterOptions.ratingAny") : option.label;

          return (
            <Pressable
              key={option.value || "any"}
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