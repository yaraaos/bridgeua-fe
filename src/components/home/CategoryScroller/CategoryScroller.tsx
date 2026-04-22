import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "./CategoryScroller.styles";

type Props = {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

export default function CategoryScroller({
  categories,
  selectedCategory,
  onSelectCategory,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
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