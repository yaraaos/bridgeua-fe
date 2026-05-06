import type {
    BusinessAbout,
    BusinessAboutFeature,
    BusinessContactItem,
    BusinessContactType,
} from "@/src/features/businesses/types/business.types";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { styles } from "./BusinessAboutSection.styles";

type Props = {
  businessName: string;
  about: BusinessAbout;
};

const contactIcons: Record<
  BusinessContactType,
  keyof typeof MaterialIcons.glyphMap
> = {
  address: "location-on",
  hours: "access-time",
  phone: "phone",
  website: "language",
  instagram: "photo-camera",
};

const featureIcons: Record<
  BusinessAboutFeature["icon"],
  keyof typeof MaterialIcons.glyphMap
> = {
  shield: "verified-user",
  leaf: "eco",
  heart: "favorite-border",
  sparkle: "auto-awesome",
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

                <MaterialIcons
                  name={
                    isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"
                  }
                  size={22}
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
                  <MaterialIcons
                    name={contactIcons[item.type]}
                    size={24}
                    style={styles.contactIcon}
                  />
                </View>

                <View style={styles.contactTextWrap}>
                  <Text style={styles.contactLabel}>{item.label}</Text>
                  <Text style={styles.contactValue}>{item.value}</Text>
                </View>

                {item.actionUrl ? (
                  <MaterialIcons
                    name="chevron-right"
                    size={26}
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
                  <MaterialIcons
                    name={featureIcons[feature.icon]}
                    size={27}
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
