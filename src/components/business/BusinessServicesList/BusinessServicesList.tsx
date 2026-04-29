import type { BusinessDetailsService } from "@/src/features/businesses/types/business.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./BusinessServicesList.styles";

type Props = {
  services: BusinessDetailsService[];
  onPressService?: (serviceId: string) => void;
};

export default function BusinessServicesList({
  services,
  onPressService,
}: Props) {
  if (services.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No services yet</Text>
        <Text style={styles.emptyText}>
          This business has not added services yet.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Services</Text>

      <View style={styles.list}>
        {services.map((service) => (
          <Pressable
            key={service.id}
            style={styles.serviceRow}
            onPress={() => onPressService?.(service.id)}
          >
            <View style={styles.iconBox}>
              <Ionicons name="sparkles-outline" size={18} style={styles.icon} />
            </View>

            <View style={styles.content}>
              <Text style={styles.serviceName}>{service.name}</Text>

              <View style={styles.metaRow}>
                {!!service.duration && (
                  <Text style={styles.metaText}>{service.duration}</Text>
                )}

                {!!service.duration && !!service.priceFrom && (
                  <Text style={styles.metaDot}>•</Text>
                )}

                {!!service.priceFrom && (
                  <Text style={styles.metaText}>From {service.priceFrom}</Text>
                )}
              </View>
            </View>

            <Ionicons name="chevron-forward" size={18} style={styles.chevron} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}