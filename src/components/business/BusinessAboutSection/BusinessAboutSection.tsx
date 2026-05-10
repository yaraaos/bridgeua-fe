import {
  BusinessAmenitiesSection,
  BusinessLanguagesSection,
  BusinessRecommendedBySection,
  BusinessSocialLinksSection,
} from "@/src/components/business";
import type { BusinessAbout } from "@/src/features/businesses/types/business.types";
import { Text, View } from "react-native";
import { styles } from "./BusinessAboutSection.styles";

type Props = {
  businessName: string;
  about: BusinessAbout;
};

export default function BusinessAboutSection({ businessName, about }: Props) {
  return (
    <>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.textColumn}>
            <Text style={styles.description}>{about.description}</Text>
          </View>
        </View>
      </View>

      <BusinessLanguagesSection languages={about.languages} />

      <BusinessAmenitiesSection amenities={about.amenities} />

      <BusinessSocialLinksSection socialLinks={about.socialLinks} />

      <BusinessRecommendedBySection
        recommendedBy={about.recommendedBy}
        onPressSeeAll={() => {
          console.log("Open full recommended by screen");
        }}
      />
    </>
  );
}
