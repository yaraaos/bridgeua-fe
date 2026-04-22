import React from "react";
import { Pressable, Text, View } from "react-native";
import styles from "./RatingSelector.styles";

const OPTIONS = ["Any rating", "4.0+", "4.5+", "5.0"];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function RatingSelector({ value, onChange }: Props) {
  return (
    <View>
      <Text style={styles.title}>FILTER BY RATING</Text>

      <View style={styles.optionsWrap}>
        {OPTIONS.map((option) => {
          const active = value === option;

          return (
            <Pressable key={option} onPress={() => onChange(option)} style={styles.optionRow}>
              <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                {active ? <View style={styles.radioInner} /> : null}
              </View>

              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          );
        })}

        <Pressable style={styles.optionRow}>
          <View style={[styles.radioOuter, value === "custom" && styles.radioOuterActive]}>
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