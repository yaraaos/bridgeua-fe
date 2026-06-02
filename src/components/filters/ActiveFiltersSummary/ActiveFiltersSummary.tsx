import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

import {
  CUISINE_OPTIONS,
  DISTANCE_OPTIONS,
  RATING_OPTIONS,
  SORT_OPTIONS,
} from "@/src/constants/filters";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import type {
  DistanceOption,
  RatingOption,
  SortOption,
} from "@/src/store/filter.store";

import { createStyles } from "./ActiveFiltersSummary.styles";

type Props = {
  sort: SortOption;
  category: string;
  cuisines: string[];
  rating: RatingOption;
  distance: DistanceOption;
  onClearSort: () => void;
  onClearCategory: () => void;
  onRemoveCuisine: (value: string) => void;
  onClearRating: () => void;
  onClearDistance: () => void;
};

type ActiveChip = {
  key: string;
  label: string;
  onRemove: () => void;
};

const getLabel = <T extends string>(
  options: { label: string; value: T }[],
  value: T,
) => options.find((option) => option.value === value)?.label ?? value;

export default function ActiveFiltersSummary({
  category,
  sort,
  cuisines,
  rating,
  distance,
  onClearSort,
  onClearCategory,
  onRemoveCuisine,
  onClearRating,
  onClearDistance,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const chips: ActiveChip[] = [];

  if (sort !== "relevance") {
    chips.push({
      key: `sort-${sort}`,
      label: getLabel(SORT_OPTIONS, sort),
      onRemove: onClearSort,
    });
  }

  if (category) {
    chips.push({
      key: `category-${category}`,
      label: category,
      onRemove: onClearCategory,
    });
  }

  cuisines.forEach((cuisine) => {
    chips.push({
      key: `cuisine-${cuisine}`,
      label: getLabel(CUISINE_OPTIONS, cuisine),
      onRemove: () => onRemoveCuisine(cuisine),
    });
  });

  if (rating) {
    chips.push({
      key: `rating-${rating}`,
      label: getLabel(RATING_OPTIONS, rating),
      onRemove: onClearRating,
    });
  }

  if (distance) {
    chips.push({
      key: `distance-${distance}`,
      label: getLabel(DISTANCE_OPTIONS, distance),
      onRemove: onClearDistance,
    });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>ACTIVE FILTERS</Text>

      <View style={styles.chipsWrap}>
        {chips.map((chip) => (
          <Pressable key={chip.key} style={styles.chip} onPress={chip.onRemove}>
            <Text style={styles.chipText}>{chip.label}</Text>
            <Feather name="x" size={13} color={colors.accentOrange} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
