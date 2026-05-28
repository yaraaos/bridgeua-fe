import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";

import AppText from "@/src/components/ui/AppText/AppText";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type Props = {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function AppAddCard({ label, onPress, style }: Props) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          padding: spacing.md,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 999,
          borderWidth: 1.5,
          borderStyle: "dashed",
          borderColor: colors.primaryGreen,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="add" size={22} color={colors.primaryGreen} />
      </View>
      <AppText
        style={{ fontSize: 14, fontWeight: "700", color: colors.primaryGreen }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
