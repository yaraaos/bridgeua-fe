import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import AppBottomSheet from "@/src/components/ui/AppBottomSheet/AppBottomSheet";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import type { GalleryPhoto } from "@/src/features/businesses/types/editBusiness.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type Props = {
  visible: boolean;
  photo: GalleryPhoto | null;
  isDefault: boolean;
  defaultCount: number;
  onClose: () => void;
  onSetDefault: () => void;
  onRemoveDefault: () => void;
  onDelete: () => void;
};

export default function GalleryPhotoActionSheet({
  visible,
  photo,
  isDefault,
  defaultCount,
  onClose,
  onSetDefault,
  onRemoveDefault,
  onDelete,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  if (!photo) return null;

  const setDefaultDisabled = !isDefault && defaultCount >= 3;
  const canSetDefault = !isDefault && defaultCount < 3;

  return (
    <AppBottomSheet visible={visible} onClose={onClose}>
      {isDefault ? (
        <Pressable
          style={styles.row}
          onPress={() => {
            onRemoveDefault();
            onClose();
          }}
        >
          <Ionicons name="star-outline" size={20} color={colors.textSecondary} />
          <AppText style={[styles.rowLabel, { color: colors.textSecondary }]}>
            Remove Default
          </AppText>
        </Pressable>
      ) : (
        <Pressable
          style={[styles.row, setDefaultDisabled && styles.rowDisabled]}
          onPress={
            canSetDefault
              ? () => {
                  onSetDefault();
                  onClose();
                }
              : undefined
          }
        >
          <Ionicons
            name="star-outline"
            size={20}
            color={canSetDefault ? colors.primaryGreen : colors.textMuted}
          />
          <View style={styles.rowContent}>
            <AppText
              style={[
                styles.rowLabel,
                { color: canSetDefault ? colors.primaryGreen : colors.textMuted },
              ]}
            >
              Set as Default
            </AppText>
            {setDefaultDisabled && (
              <AppText style={styles.rowCaption}>
                Maximum 3 default photos selected
              </AppText>
            )}
          </View>
        </Pressable>
      )}

      <View style={styles.separator} />

      <Pressable style={styles.row} onPress={onDelete}>
        <Ionicons name="trash-outline" size={20} color={colors.error} />
        <AppText style={[styles.rowLabel, { color: colors.error }]}>Delete Photo</AppText>
      </Pressable>
    </AppBottomSheet>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    rowDisabled: {
      opacity: 0.6,
    },
    rowContent: {
      flex: 1,
      gap: 2,
    },
    rowLabel: {
      fontSize: 16,
      fontWeight: "500",
    },
    rowCaption: {
      fontSize: 12,
      color: colors.textMuted,
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginHorizontal: spacing.lg,
    },
  });
}
