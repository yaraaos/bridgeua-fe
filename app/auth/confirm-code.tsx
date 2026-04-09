import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import { colors } from "../../src/constants/colors";

export default function ConfirmCodeScreen() {
  return (
    <AppScreen style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>Enter confirmation code</Text>
        <Text style={styles.subtitle}>A 4-digit code was sent to your email</Text>

        <View style={styles.row}>
          <View style={styles.box} />
          <View style={styles.box} />
          <View style={styles.box} />
          <View style={styles.box} />
        </View>
      </View>

      <View style={styles.actions}>
        <AppButton title="Resend Code" variant="ghost" />
        <AppButton title="Continue" onPress={() => router.replace("/(tabs)/home")} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  center: {
    alignItems: "center",
    marginTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 8,
    textAlign: "center",
    color: colors.textSecondary,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  box: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  actions: {
    gap: 12,
  },
});