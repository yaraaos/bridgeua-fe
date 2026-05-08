import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import { colors } from "../../src/constants/colors";

export default function AuthSuccessScreen() {
  return (
    <AppScreen style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Feather name="check" size={40} color={colors.white} />
        </View>

        <Text style={styles.title}>Account confirmed</Text>
        <Text style={styles.subtitle}>
          Your account has been verified successfully. You can now start using
          BridgeUA.
        </Text>
      </View>

      <AppButton
        title="Continue"
        onPress={() => router.replace("/(tabs)/home")}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    paddingVertical: 40,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primaryGreen,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
