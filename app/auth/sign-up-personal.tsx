import { Link, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppInput from "../../src/components/ui/AppInput/AppInput";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import { colors } from "../../src/constants/colors";

export default function SignUpScreen() {
  return (
    <AppScreen style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>It only takes a moment</Text>
      </View>

      <View style={styles.form}>
        <AppInput placeholder="Email address" />
        <AppInput placeholder="Password" secureTextEntry />
        <AppInput placeholder="Confirm password" secureTextEntry />
        <AppButton title="Continue" onPress={() => router.push("/auth/confirm-code")} />
      </View>

      <Text style={styles.footer}>
        Already have an account? <Link href="/auth/sign-in" style={styles.link}>Sign in</Link>
      </Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    gap: 24,
  },
  header: {
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.primaryGreen,
  },
  subtitle: {
    color: colors.textSecondary,
  },
  form: {
    gap: 12,
  },
  footer: {
    textAlign: "center",
    color: colors.textSecondary,
  },
  link: {
    color: colors.primaryGreen,
    fontWeight: "700",
  },
});