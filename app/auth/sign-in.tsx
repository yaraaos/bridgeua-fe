import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppInput from "../../src/components/ui/AppInput/AppInput";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import { colors } from "../../src/constants/colors";

export default function SignInScreen() {
  return (
    <AppScreen style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome!</Text>
      </View>

      <View style={styles.form}>
        <AppInput placeholder="Email address" />
        <AppInput placeholder="Password" secureTextEntry />
        <Text style={styles.forgot}>Forgot password?</Text>
        <AppButton
          title="Login"
          onPress={() => router.replace("/(tabs)/home")}
        />
      </View>

      <Text style={styles.footer}>
        <Text onPress={() => router.push("/auth/sign-up-personal")}>
          Not a member? Register now
        </Text>
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
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.primaryGreen,
  },
  form: {
    gap: 12,
  },
  forgot: {
    color: colors.primaryGreen,
    fontSize: 13,
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
