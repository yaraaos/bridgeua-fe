import type { BusinessAmenity } from "@/src/features/businesses/types/business.types";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { styles } from "./BusinessAmenitiesSection.styles";

type Props = {
  amenities?: BusinessAmenity[];
};

const amenityIcons: Record<
  BusinessAmenity["icon"],
  keyof typeof Ionicons.glyphMap
> = {
  wifi: "wifi-outline",
  parking: "car-outline",
  pet: "paw-outline",
  accessibility: "accessibility-outline",
  coffee: "cafe-outline",
};

export default function BusinessAmenitiesSection({ amenities }: Props) {
  if (!amenities?.length) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Amenities</Text>

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