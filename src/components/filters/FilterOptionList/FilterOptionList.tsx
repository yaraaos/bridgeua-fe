import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/src/constants/colors";
import type { FilterOption } from "@/src/constants/filters";
import styles from "./FilterOptionList.styles";

type RadioProps<T extends string> = {
  title: string;
  type: "radio";
  options: FilterOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
};

type CheckboxProps = {
  title: string;
  type: "checkbox";
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
};

type Props<T extends string> = RadioProps<T> | CheckboxProps;

export default function FilterOptionList<T extends string>(props: Props<T>) {
  return (
    <View>
      <Text style={styles.title}>{props.title}</Text>

      <View style={styles.optionsWrap}>
        {props.type === "radio"
          ? props.options.map((option) => {
              const active = props.selectedValue === option.value;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => props.onSelect(option.value)}
                  style={styles.optionRow}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      active && styles.radioOuterActive,
                    ]}
                  >
                    {active ? <View style={styles.radioInner} /> : null}
                  </View>

                  <Text style={styles.optionText}>{option.label}</Text>
                </Pressable>
              );
            })
          : props.options.map((option) => {
              const active = props.selectedValues.includes(option);

              return (
                <Pressable
                  key={option}
                  onPress={() => props.onToggle(option)}
                  style={styles.optionRow}
                >
                  <View
                    style={[styles.checkbox, active && styles.checkboxActive]}
                  >
                    {active ? (
                      <Feather name="check" size={12} color={colors.white} />
                    ) : null}
                  </View>

                  <Text style={styles.optionText}>{option}</Text>
                </Pressable>
              );
            })}
      </View>
    </View>
  );
}
