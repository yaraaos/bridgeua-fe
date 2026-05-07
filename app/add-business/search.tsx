import { FlatList, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppInput from "../../src/components/ui/AppInput/AppInput";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import BusinessCard from "../../src/components/business/BusinessCard/BusinessCard";
import { AppColors } from "@/src/constants/colors";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { businessesMock } from "@/src/mocks/businesses.mock";

export default function AddBusinessSearchScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <AppScreen>
      <Text style={styles.title}>Add a business</Text>
      <AppInput placeholder="Search business name" />

      <Text style={styles.helper}>Similar places found. Did you mean one of these?</Text>

      <FlatList
        data={businessesMock}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BusinessCard business={item} />}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
      />

      <AppButton title="No :) Add a new business" variant="secondary" onPress={() => router.push("/add-business/form")} />
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    title: {
      fontSize: 30,
      fontWeight: "800",
      color: colors.textPrimary,
      marginBottom: 12,
    },
    helper: {
      marginTop: 16,
      color: colors.textSecondary,
      fontWeight: "600",
    },
  });
}