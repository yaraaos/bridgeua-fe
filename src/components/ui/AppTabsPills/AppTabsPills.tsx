import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./AppTabsPills.styles";

export type AppTabPillItem<T extends string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  tabs: AppTabPillItem<T>[];
  activeTab: T;
  onChange: (value: T) => void;
};

export default function AppTabsPills<T extends string>({
  tabs,
  activeTab,
  onChange,
}: Props<T>) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;

        return (
          <Pressable
            key={tab.value}
            onPress={() => onChange(tab.value)}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}