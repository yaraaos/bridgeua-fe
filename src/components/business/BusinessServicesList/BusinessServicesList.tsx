import type { BusinessDetailsService } from "@/src/features/businesses/types/business.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { createStyles } from "./BusinessServicesList.styles";

type Props = {
  services: BusinessDetailsService[];
  onPressService?: (service: BusinessDetailsService) => void;
  disabled?: boolean;
};

export default function BusinessServicesList({
  services,
  onPressService,
  disabled,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  if (services.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>{t("businessServices.emptyTitle")}</Text>
        <Text style={styles.emptyText}>
          {t("businessServices.emptyDesc")}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, disabled && { opacity: 0.5 }]}>
      <View>
        {services.map((service, index) => (
          <Pressable
            key={service.id}
            style={[
              styles.serviceRow,
              index !== 0 ? styles.serviceRowBordered : null,
            ]}
            onPress={disabled ? undefined : () => onPressService?.(service)}
            disabled={!onPressService}
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
                  <Text style={styles.metaText}>{t("teamMember.priceFrom")} {service.priceFrom}</Text>
                )}
              </View>
            </View>

            {onPressService ? (
              <Ionicons
                name="chevron-forward"
                size={18}
                style={styles.chevron}
              />
            ) : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
}