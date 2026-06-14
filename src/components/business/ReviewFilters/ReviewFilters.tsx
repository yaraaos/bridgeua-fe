import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { createStyles } from "./ReviewFilters.styles";

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
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const filterLabels: Record<ReviewFilterOption, string> = {
    "Most relevant": t("reviewFilters.mostRelevant"),
    "Newest": t("reviewFilters.newest"),
    "Highest": t("reviewFilters.highest"),
    "Lowest": t("reviewFilters.lowest"),
  };

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
              {filterLabels[filter]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}