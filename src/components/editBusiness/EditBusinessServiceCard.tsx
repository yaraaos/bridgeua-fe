import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import AppInput from "@/src/components/ui/AppInput/AppInput";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import type { ConfiguredService } from "@/src/features/businesses/types/editBusiness.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type Props = {
  service: ConfiguredService;
  onRemove: () => void;
  onDurationChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  showValidation: boolean;
};

export default function EditBusinessServiceCard({
  service,
  onRemove,
  onDurationChange,
  onPriceChange,
  showValidation,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const durationError = showValidation && service.duration.trim() === "";
  const priceError = showValidation && service.price.trim() === "";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <AppText style={styles.name} numberOfLines={1}>
          {service.name}
        </AppText>
        <Pressable onPress={onRemove} hitSlop={8} style={styles.removeButton}>
          <Ionicons name="close-circle" size={20} color={colors.textMuted} />
        </Pressable>
      </View>

      <View style={styles.fieldsRow}>
        <View style={styles.fieldWrap}>
          <AppText style={styles.fieldLabel}>Duration (min)</AppText>
          <AppInput
            value={service.duration}
            onChangeText={onDurationChange}
            keyboardType="numeric"
            placeholder="60"
            error={durationError}
          />
          {durationError && (
            <AppText style={styles.errorText}>Required</AppText>
          )}
        </View>

        <View style={styles.fieldWrap}>
          <AppText style={styles.fieldLabel}>Price ($)</AppText>
          <AppInput
            value={service.price}
            onChangeText={onPriceChange}
            keyboardType="decimal-pad"
            placeholder="45.00"
            error={priceError}
          />
          {priceError && (
            <AppText style={styles.errorText}>Required</AppText>
          )}
        </View>
      </View>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      gap: spacing.md,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    name: {
      flex: 1,
      fontSize: 15,
      fontWeight: "700",
      color: colors.textPrimary,
      marginRight: spacing.sm,
    },
    removeButton: {
      padding: 2,
    },
    fieldsRow: {
      flexDirection: "row",
      gap: spacing.md,
    },
    fieldWrap: {
      flex: 1,
      gap: spacing.xs,
    },
    fieldLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    errorText: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.error,
      marginTop: 2,
    },
  });
}
