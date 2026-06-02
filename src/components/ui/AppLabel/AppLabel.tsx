import type { AppColors } from "@/src/constants/colors";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type AppLabelVariant =
  | "draft"
  | "published"
  | "unpublished"
  | "owner"
  | "your-business"
  | "featured"
  | "confirmed"
  | "pending"
  | "cancelled"
  | "completed";

type Props = {
  label: string;
  variant: AppLabelVariant;
};

export default function AppLabel({ label, variant }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const variantKey = variant.replace("-", "_") as keyof ReturnType<
    typeof createStyles
  >;

  return (
    <View style={[styles.base, styles[variantKey] as any]}>
      <Text
        style={[
          styles.text,
          styles[
            `${variantKey}_text` as keyof ReturnType<typeof createStyles>
          ] as any,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    base: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
      alignSelf: "flex-start",
    },
    text: {
      fontSize: 10,
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },

    draft: { backgroundColor: colors.accentOrangeSoft },
    draft_text: { color: colors.accentOrange },

    published: { backgroundColor: colors.primaryGreenSoft },
    published_text: { color: colors.primaryGreen },

    unpublished: { backgroundColor: colors.surface },
    unpublished_text: { color: colors.textMuted },

    owner: { backgroundColor: colors.accentOrangeSoft },
    owner_text: { color: colors.accentOrange },

    your_business: { backgroundColor: colors.accentOrange },
    your_business_text: { color: colors.accentOrangeSoft },

    featured: { backgroundColor: colors.accentOrangeSoft },
    featured_text: { color: colors.accentOrange },

    confirmed: { backgroundColor: colors.primaryGreenSoft },
    confirmed_text: { color: colors.primaryGreen },

    pending: { backgroundColor: colors.accentOrangeSoft },
    pending_text: { color: colors.accentOrange },

    cancelled: { backgroundColor: colors.errorSoft },
    cancelled_text: { color: colors.error },

    completed: { backgroundColor: colors.surface },
    completed_text: { color: colors.textSecondary },
  });
}
