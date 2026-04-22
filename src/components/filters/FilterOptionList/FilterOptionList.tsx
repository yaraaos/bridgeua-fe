import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "../../../constants/colors";
import styles from "./FilterOptionList.styles";

type Props =
  | {
      title: string;
      type: "radio";
      options: string[];
      selectedValue: string;
      onSelect: (value: string) => void;
    }
  | {
      title: string;
      type: "checkbox";
      options: string[];
      selectedValues: string[];
      onToggle: (value: string) => void;
    };

export default function FilterOptionList(props: Props) {
  return (
    <View>
      <Text style={styles.title}>{props.title}</Text>

      <View style={styles.optionsWrap}>
        {props.options.map((option) => {
          const active =
            props.type === "radio"
              ? props.selectedValue === option
              : props.selectedValues.includes(option);

          return (
            <Pressable
              key={option}
              onPress={() =>
                props.type === "radio"
                  ? props.onSelect(option)
                  : props.onToggle(option)
              }
              style={styles.optionRow}
            >
              {props.type === "radio" ? (
                <View
                  style={[styles.radioOuter, active && styles.radioOuterActive]}
                >
                  {active ? <View style={styles.radioInner} /> : null}
                </View>
              ) : (
                <View
                  style={[styles.checkbox, active && styles.checkboxActive]}
                >
                  {active ? (
                    <Feather name="check" size={12} color={colors.white} />
                  ) : null}
                </View>
              )}

              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
