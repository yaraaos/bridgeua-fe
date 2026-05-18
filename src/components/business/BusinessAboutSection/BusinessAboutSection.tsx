import {
  BusinessAmenitiesSection,
  BusinessLanguagesSection,
  BusinessRecommendedBySection,
} from "@/src/components/business";
import type {
  BusinessAbout,
  BusinessRecommendation,
} from "@/src/features/businesses/types/business.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { createStyles } from "./BusinessAboutSection.styles";

type Props = {
  businessId: string;
  about: BusinessAbout;
};

export default function BusinessAboutSection({ businessId, about }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.textColumn}>
            <Text style={styles.description}>{about.description}</Text>
          </View>
        </View>
      </View>

      <BusinessRecommendedBySection
        recommends={about.recommendedBy}
        onPressSeeAll={() =>
          router.push({
            pathname: "/business/recommends",
            params: {
              businessId,
            },
          })
        }
        onPressRecommendation={(recommendation: BusinessRecommendation) =>
          router.push({
            pathname: "/business/[id]",
            params: {
              id: recommendation.businessId,
            },
          })
        }
      />

      <BusinessLanguagesSection languages={about.languages} />

      <BusinessAmenitiesSection amenities={about.amenities} />
    </>
  );
}
