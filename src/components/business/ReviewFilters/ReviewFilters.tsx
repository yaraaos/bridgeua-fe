import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./ReviewFilters.styles";

export type ReviewFilterOption =
  | "Most relevant"
  | "Newest"
  | "Highest"
  | "Lowest";

type Props = {
  value: ReviewFilterOption;
  onChange: (value: ReviewFilterOption) => void;
};

const FILTERS: ReviewFilterOption[] = [
  "Most relevant",
  "Newest",
  "Highest",
  "Lowest",
];

export default function ReviewFilters({ value, onChange }: Props) {
  return (
    <View style={styles.filtersRow}>
      {FILTERS.map((filter) => {
        const isActive = value === filter;

        return (
          <Pressable
            key={filter}
            onPress={() => onChange(filter)}
            style={[styles.filterChip, isActive && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
              {filter}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}