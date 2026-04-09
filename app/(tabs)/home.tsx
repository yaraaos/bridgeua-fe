import { FlatList, StyleSheet, Text, View } from "react-native";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import GradientHeader from "../../src/components/ui/GradientHeader/GradientHeader";
import AppInput from "../../src/components/ui/AppInput/AppInput";
import BusinessCard from "../../src/components/business/BusinessCard/BusinessCard";
import { colors } from "../../src/constants/colors";
import { businessesMock } from "../../src/mocks/businesses.mock";

export default function HomeScreen() {
  return (
    <AppScreen style={styles.container}>
      <GradientHeader>
        <Text style={styles.location}>Location</Text>
        <Text style={styles.locationValue}>California, USA</Text>
        <Text style={styles.title}>Discover</Text>
        <View style={styles.searchWrap}>
          <AppInput placeholder="Find services, food or places" />
        </View>
      </GradientHeader>

      <View style={styles.listWrap}>
        <FlatList
          data={businessesMock}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BusinessCard business={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  location: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  locationValue: {
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: 2,
    marginBottom: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  searchWrap: {
    marginBottom: 8,
  },
  listWrap: {
    flex: 1,
    padding: 16,
  },
});