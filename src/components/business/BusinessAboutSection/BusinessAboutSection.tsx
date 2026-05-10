import {
  BusinessAmenitiesSection,
  BusinessLanguagesSection,
  BusinessRecommendedBySection,
  BusinessSocialLinksSection,
} from "@/src/components/business";
import type { BusinessAbout } from "@/src/features/businesses/types/business.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Text, View } from "react-native";
import { createStyles } from "./BusinessAboutSection.styles";

type Props = {
  businessName: string;
  about: BusinessAbout;
};

export default function BusinessAboutSection({ about }: Props) {
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
        onPressSeeAll={() => {
          console.log("Open full recommended by screen");
        }}
      />

      <BusinessSocialLinksSection socialLinks={about.socialLinks} />

      <BusinessLanguagesSection languages={about.languages} />

      <BusinessAmenitiesSection amenities={about.amenities} />
    </>
  );
}
