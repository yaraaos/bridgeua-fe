import React from "react";
import { Text, TextInput, View, Pressable } from "react-native";
import styles from "./DistanceSelector.styles";
import { colors } from "../../../constants/colors";

const OPTIONS = ["Nearby", "1 km", "5 km", "10 km", "25 km"];

type Props = {
  value: string;
  customValue: string;
  onChange: (value: string) => void;
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

        <View style={styles.optionRow}>
          <View style={[styles.radioOuter, value === "custom" && styles.radioOuterActive]}>
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