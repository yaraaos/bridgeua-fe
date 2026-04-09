import { router } from "expo-router";
import { View } from "react-native";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";

export default function AddScreen() {
  return (
    <AppScreen style={{ justifyContent: "center" }}>
      <View style={{ gap: 12 }}>
        <AppButton title="Check existing business" onPress={() => router.push("/add-business/search")} />
        <AppButton title="Add new business" variant="secondary" onPress={() => router.push("/add-business/form")} />
      </View>
    </AppScreen>
  );
}