import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import { useBusinessDetails } from "@/src/features/businesses/hooks/useBusiness";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function BusinessDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { business, isLoading } = useBusinessDetails(id);

  if (isLoading) {
    return (
      <AppScreen style={styles.center}>
        <ActivityIndicator />
      </AppScreen>
    );
  }

  if (!business) {
    return (
      <AppScreen style={styles.center}>
        <Text>Business not found</Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen style={styles.container}>
      <View>
        <Text style={styles.name}>{business.name}</Text>
        <Text style={styles.meta}>{business.category}</Text>
        <Text style={styles.meta}>{business.location}</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Rating</Text>
          <Text>{business.rating} / 5</Text>
          <Text>{business.reviewCount} reviews</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Address</Text>
          <Text>{business.address}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Website</Text>
          <Text>{business.website}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Opening hours</Text>
          <Text>
            {business.isOpen ? "Open" : "Closed"} · Closes at{" "}
            {business.closesAt}
          </Text>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
  },
  meta: {
    marginTop: 4,
    color: "#6B7280",
  },
  section: {
    marginTop: 24,
  },
  label: {
    marginBottom: 6,
    fontWeight: "700",
  },
});
