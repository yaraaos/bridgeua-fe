import type { BusinessAmenity } from "@/src/features/businesses/types/business.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { createStyles } from "./BusinessAmenitiesSection.styles";

type Props = {
  amenities?: BusinessAmenity[];
};

const amenityIcons: Record<
  BusinessAmenity["icon"],
  keyof typeof Ionicons.glyphMap
> = {
  wifi: "wifi-outline",
  parking: "car-outline",
  ac: "snow-outline",
  pet: "paw-outline",
  accessibility: "accessibility-outline",
  coffee: "cafe-outline",
  tv: "tv-outline",
  outdoor: "umbrella-outline",
};

export default function BusinessAmenitiesSection({ amenities }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  if (!amenities?.length) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t("business.amenities")}</Text>

      <View style={styles.grid}>
        {amenities.map((amenity) => (
          <View key={amenity.id} style={styles.item}>
            <View style={styles.iconWrap}>
              <Ionicons
                name={amenityIcons[amenity.icon]}
                size={18}
                style={styles.icon}
              />
            </View>

            <Text style={styles.label}>{amenity.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}