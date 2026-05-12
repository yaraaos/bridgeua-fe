import { ActivityIndicator, View } from "react-native";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { createStyles } from "./AppLoader.styles";

export default function AppLoader() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primaryGreen} />
    </View>
  );
}