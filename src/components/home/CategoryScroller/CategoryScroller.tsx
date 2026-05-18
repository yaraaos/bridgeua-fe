import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { createStyles } from "./CategoryScroller.styles";

type Props = {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
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
          const isActive = category === selectedCategory;

          return (
            <Pressable
              key={category}
              onPress={() => onSelectCategory(category)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {category}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}