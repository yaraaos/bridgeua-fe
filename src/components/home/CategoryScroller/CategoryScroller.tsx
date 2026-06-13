import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { createStyles } from "./CategoryScroller.styles";

type CategoryItem = {
  label: string;
  value: string;
};

type Props = {
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (value: string) => void;
  overlay?: boolean;
};

export default function CategoryScroller({
  categories,
  selectedCategory,
  onSelectCategory,
  overlay = false,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={[styles.wrapper, overlay && styles.wrapperOverlay]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          overlay && styles.contentOverlay,
        ]}
      >
        {categories.map((category) => {
          const isActive = category.value === selectedCategory;

          return (
            <Pressable
              key={category.value}
              onPress={() => onSelectCategory(category.value)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {category.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}