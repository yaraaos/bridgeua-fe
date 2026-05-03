import { router } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import { colors } from "../../src/constants/colors";

export default function SplashScreen() {
  return (
    <AppScreen style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.logo}>
          Bridge<Text style={styles.ua}>UA</Text>
        </Text>
        <Text style={styles.subtitle}>Recommendations built on trust</Text>
      </View>

      <AppButton title="Start" onPress={() => router.replace("/onboarding")} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 40,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  ua: {
    color: colors.primaryGreen,
  },
  subtitle: {
    marginTop: 8,
    color: colors.textSecondary,
  },
});