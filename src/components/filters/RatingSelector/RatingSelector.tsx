import React from "react";
import { Pressable, Text, View } from "react-native";

import { RATING_OPTIONS } from "@/src/constants/filters";
import type { RatingOption } from "@/src/store/filter.store";
import styles from "./RatingSelector.styles";

type Props = {
  value: RatingOption;
  onChange: (value: RatingOption) => void;
};

export default function RatingSelector({ value, onChange }: Props) {
  return (
    <View>
      <Text style={styles.title}>FILTER BY RATING</Text>

      <View style={styles.optionsWrap}>
        {RATING_OPTIONS.map((option) => {
          const active = value === option.value;

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

              <Text style={styles.optionText}>{option.label}</Text>
            </Pressable>
          );
        })}

        <Pressable style={styles.optionRow}>
          <View
            style={[
              styles.radioOuter,
              value === "custom" && styles.radioOuterActive,
            ]}
          >
            {value === "custom" ? <View style={styles.radioInner} /> : null}
          </View>

          <View style={styles.customRangeWrap}>
            <Text style={styles.optionText}>Custom range</Text>
            <Text style={styles.dropdownText}>⌄</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
