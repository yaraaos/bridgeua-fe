import AppText from "@/src/components/ui/AppText/AppText";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";
import { createStyles } from "./OwnerPromotionEmptyCard.styles";

type Props = {
  onPressCreate: () => void;
};

export default function OwnerPromotionEmptyCard({ onPressCreate }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <AppText style={styles.title}>No promotions yet</AppText>
          <AppText style={styles.description}>
            Create your first promotion to share an offer with customers.
          </AppText>
        </View>
        <Pressable onPress={onPressCreate} style={styles.addButton}>
          <Ionicons name="add" size={20} color={colors.surface} />
        </Pressable>
      </View>
    </View>
  );
}
