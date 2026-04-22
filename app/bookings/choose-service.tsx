//app/bookings/choose-services.tsx

import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import ServiceSelectionCard from "../../src/components/bookings/ServiceSelectionCard/ServiceSelectionCard";
import { colors } from "../../src/constants/colors";

export default function ChooseServicesScreen() {
  const [selectedId, setSelectedId] = useState<string>("1");

  const services = [
    {
      id: "1",
      title: "Gel Manicure",
      subtitle: "Long lasting manicure with gel polish",
      duration: "75 min",
      price: "$70",
      imageUrl: "https://picsum.photos/200/200?11",
    },
    {
      id: "2",
      title: "French Manicure",
      subtitle: "Classic finish and neat design",
      duration: "60 min",
      price: "$25",
      imageUrl: "https://picsum.photos/200/200?12",
    },
  ];

  return (
    <AppScreen style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose one or more services</Text>
      </View>

      <View style={styles.list}>
        {services.map((service) => (
          <ServiceSelectionCard
            key={service.id}
            title={service.title}
            subtitle={service.subtitle}
            duration={service.duration}
            price={service.price}
            imageUrl={service.imageUrl}
            isSelected={selectedId === service.id}
            onPress={() => setSelectedId(service.id)}
          />
        ))}
      </View>

      <AppButton title="Next Step" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
  header: {
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  list: {
    flex: 1,
    gap: 12,
    marginTop: 16,
  },
});