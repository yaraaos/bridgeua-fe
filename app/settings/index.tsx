import { StyleSheet, Text, View } from "react-native";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import { colors } from "../../src/constants/colors";

export default function SettingsScreen() {
  return (
    <AppScreen>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.list}>
        <Text style={styles.item}>Account</Text>
        <Text style={styles.item}>Notifications</Text>
        <Text style={styles.item}>Privacy</Text>
        <Text style={styles.item}>Language</Text>
        <Text style={styles.item}>Help</Text>
        <Text style={styles.item}>Terms</Text>
        <Text style={styles.item}>About</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  list: {
    gap: 14,
  },
  item: {
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E1",
  },
});