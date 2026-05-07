import type { BusinessRecommendation } from "@/src/features/businesses/types/business.types";
import { Image, Text, View } from "react-native";
import { styles } from "./BusinessRecommendedBySection.styles";

type Props = {
  recommendedBy?: BusinessRecommendation[];
};

export default function BusinessRecommendedBySection({
  recommendedBy,
}: Props) {
  if (!recommendedBy?.length) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Recommended by</Text>

      <View style={styles.list}>
        {recommendedBy.map((item) => (
          <View key={item.id} style={styles.item}>
            {item.avatarUrl ? (
              <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarFallbackText}>
                  {item.name.charAt(0)}
                </Text>
              </View>
            )}

            <View style={styles.textWrap}>
              <Text style={styles.name}>{item.name}</Text>

              {item.subtitle ? (
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}