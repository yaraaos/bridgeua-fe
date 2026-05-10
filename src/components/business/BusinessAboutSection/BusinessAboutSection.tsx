import {
  BusinessAmenitiesSection,
  BusinessLanguagesSection,
  BusinessRecommendedBySection,
  BusinessSocialLinksSection,
} from "@/src/components/business";
import type {
  BusinessAbout
} from "@/src/features/businesses/types/business.types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./BusinessAboutSection.styles";

type Props = {
  businessName: string;
  about: BusinessAbout;
};

export default function BusinessAboutSection({ businessName, about }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTextTruncated, setIsTextTruncated] = useState(false);

  const shouldShowReadMore = isTextTruncated || isExpanded;

  return (
    <>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.textColumn}>
            <Text
              style={styles.description}
              numberOfLines={isExpanded ? undefined : 4}
              onTextLayout={(event) => {
                if (!isExpanded) {
                  setIsTextTruncated(event.nativeEvent.lines.length > 4);
                }
              }}
            >
              {about.description}
            </Text>

            {shouldShowReadMore ? (
              <Pressable
                style={styles.readMoreButton}
                onPress={() => setIsExpanded((value) => !value)}
              >
                <Text style={styles.readMoreText}>
                  {isExpanded ? "Read less" : "Read more"}
                </Text>

                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={18}
                  style={styles.readMoreIcon}
                />
              </Pressable>
            ) : null}
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
