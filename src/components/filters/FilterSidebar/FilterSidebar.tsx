import React from "react";
import { Pressable, Text, View } from "react-native";
import styles from "./FilterSidebar.styles";

type Item<T extends string> = {
  key: T;
  label: string;
};

type Props<T extends string> = {
  items: Item<T>[];
  activeKey: T;
  onChange: (key: T) => void;
};

export default function FilterSidebar<T extends string>({
  items,
  activeKey,
  onChange,
}: Props<T>) {
  return (
    <View style={styles.sidebar}>
      {items.map((item) => {
        const active = item.key === activeKey;

        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.key)}
            style={styles.item}
          >
            <View style={styles.itemRow}>
              {active ? (
                <View style={styles.activeDot} />
              ) : (
                <View style={styles.inactiveDot} />
              )}
              <Text style={[styles.itemText, active && styles.itemTextActive]}>
                {item.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
