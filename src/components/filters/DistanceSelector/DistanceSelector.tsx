import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { colors } from "@/src/constants/colors";
import { DISTANCE_OPTIONS } from "@/src/constants/filters";
import type { DistanceOption } from "@/src/store/filter.store";
import styles from "./DistanceSelector.styles";

type Props = {
  value: DistanceOption;
  customValue: string;
  onChange: (value: DistanceOption) => void;
  onChangeCustom: (value: string) => void;
};

export default function DistanceSelector({
  value,
  customValue,
  onChange,
  onChangeCustom,
}: Props) {
  return (
    <View>
      <Text style={styles.title}>FILTER BY DISTANCE</Text>

      <View style={styles.optionsWrap}>
        {DISTANCE_OPTIONS.map((option) => {
          const active = value === option.value;

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

              <Text style={styles.optionText}>{option.label}</Text>
            </Pressable>
          );
        })}

        <View style={styles.optionRow}>
          <View
            style={[
              styles.radioOuter,
              value === "custom" && styles.radioOuterActive,
            ]}
          >
            {value === "custom" ? <View style={styles.radioInner} /> : null}
          </View>

          <View style={styles.customWrap}>
            <TextInput
              value={customValue}
              onChangeText={(text) => {
                onChange("custom");
                onChangeCustom(text);
              }}
              placeholder="Custom range"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
            <Text style={styles.kmText}>km</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
