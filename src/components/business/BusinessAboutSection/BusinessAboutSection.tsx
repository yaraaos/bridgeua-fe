import type {
    BusinessAbout,
    BusinessAboutFeature,
    BusinessContactItem,
    BusinessContactType,
} from "@/src/features/businesses/types/business.types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { styles } from "./BusinessAboutSection.styles";

type Props = {
  businessName: string;
  about: BusinessAbout;
};

const contactIcons: Record<
  BusinessContactType,
  keyof typeof Ionicons.glyphMap
> = {
  address: "location-outline",
  hours: "time-outline",
  phone: "call-outline",
  website: "globe-outline",
  instagram: "logo-instagram",
};

const featureIcons: Record<
  BusinessAboutFeature["icon"],
  keyof typeof Ionicons.glyphMap
> = {
  shield: "shield-checkmark-outline",
  leaf: "leaf-outline",
  heart: "heart-outline",
  sparkle: "sparkles-outline",
};

export default function BusinessAboutSection({ businessName, about }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTextTruncated, setIsTextTruncated] = useState(false);

  const shouldShowReadMore = isTextTruncated || isExpanded;

  const handlePressContact = async (item: BusinessContactItem) => {
    if (!item.actionUrl) return;

    const canOpen = await Linking.canOpenURL(item.actionUrl);

    if (canOpen) {
      await Linking.openURL(item.actionUrl);
    }
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.textColumn}>
            <Text style={styles.title}>
              {about.title ?? `About ${businessName}`}
            </Text>

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

        <View style={styles.contactList}>
          {about.contacts.map((item, index) => {
            const isLastItem = index === about.contacts.length - 1;

            return (
              <Pressable
                key={item.id}
                style={[
                  styles.contactRow,
                  isLastItem ? styles.contactRowLast : null,
                ]}
                onPress={() => handlePressContact(item)}
                disabled={!item.actionUrl}
              >
                <View style={styles.contactIconWrap}>
                  <Ionicons
                    name={contactIcons[item.type]}
                    size={18}
                    style={styles.contactIcon}
                  />
                </View>

                <View style={styles.contactTextWrap}>
                  <Text style={styles.contactLabel}>{item.label}</Text>
                  <Text
                    style={styles.contactValue}
                    numberOfLines={item.type === "address" ? 1 : undefined}
                    ellipsizeMode="tail"
                  >
                    {item.value}
                  </Text>
                </View>

                {item.actionUrl ? (
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    style={styles.chevron}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      {about.features.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.featuresTitle}>Why clients love us</Text>

          <View style={styles.featuresGrid}>
            {about.features.map((feature) => (
              <View key={feature.id} style={styles.featureItem}>
                <View style={styles.featureIconWrap}>
                  <Ionicons
                    name={featureIcons[feature.icon]}
                    size={18}
                    style={styles.featureIcon}
                  />
                </View>

                <Text style={styles.featureLabel}>{feature.label}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </>
  );
}
