import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import GradientHeader from "../../src/components/ui/GradientHeader/GradientHeader";
import { colors } from "../../src/constants/colors";

export default function OnboardingScreen() {
  return (
    <AppScreen style={styles.container}>
      <GradientHeader>
        <View style={styles.hero}>
          <Text style={styles.logo}>
            Bridge<Text style={styles.ua}>UA</Text>
          </Text>
          <Text style={styles.tagline}>Recommendations built on trust</Text>
        </View>
      </GradientHeader>

      <View style={styles.content}>
        <Text style={styles.title}>Find businesses you can trust</Text>
        <Text style={styles.subtitle}>Real recommendations from real people</Text>
      </View>

      <AppButton title="Next" onPress={() => router.replace("/auth/sign-in")} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    paddingBottom: 32,
  },
  hero: {
    height: 260,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  ua: {
    color: colors.primaryGreen,
  },
  tagline: {
    marginTop: 6,
    color: colors.textSecondary,
  },
  content: {
    gap: 8,
    paddingVertical: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitle: {
    color: colors.textSecondary,
  },
});