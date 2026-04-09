import { StyleSheet, Text, View } from "react-native";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppInput from "../../src/components/ui/AppInput/AppInput";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import { colors } from "../../src/constants/colors";

export default function AddBusinessFormScreen() {
  return (
    <AppScreen scroll>
      <Text style={styles.title}>Add a business</Text>
      <Text style={styles.subtitle}>Help others discover great places</Text>

      <View style={styles.form}>
        <AppInput placeholder="Business name*" />
        <AppInput placeholder="Category*" />
        <AppInput
          placeholder="Description"
          multiline
          style={{ height: 110, textAlignVertical: "top", paddingTop: 14 }}
        />
        <AppInput placeholder="Address*" />
        <AppInput placeholder="City*" />
        <AppInput placeholder="Country*" />
        <AppInput placeholder="Website" />
      </View>

      <AppButton title="Add business +" variant="secondary" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.textPrimary,
    marginTop: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 20,
  },
  form: {
    gap: 12,
    marginBottom: 24,
  },
});