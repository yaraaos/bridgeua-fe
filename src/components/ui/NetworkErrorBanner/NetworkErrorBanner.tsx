import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  message?: string;
};

export default function NetworkErrorBanner({
  message = "No internet connection",
}: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.banner, { backgroundColor: colors.error }]}>
      <Feather name="wifi-off" size={14} color={colors.white} />
      <Text style={[styles.text, { color: colors.white }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 13,
    fontWeight: "500",
  },
});