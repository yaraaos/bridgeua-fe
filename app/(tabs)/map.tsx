import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function MapScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <AppScreen style={styles.screen}>
      <View style={styles.card}>
        <Feather name="map" size={32} color={colors.primaryGreen} />
        <Text style={styles.title}>Map</Text>
        <Text style={styles.subtitle}>
          Explore businesses near you on the map.
        </Text>
      </View>
    </AppScreen>
  );
}

function createStyles(colors: ReturnType<typeof useAppTheme>["colors"]) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: colors.background,
    },
    card: {
      alignItems: "center",
      gap: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
    },
  });
}
