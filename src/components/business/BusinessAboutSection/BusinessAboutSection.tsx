import { BusinessExpandableInfoRow } from "@/src/components/business";
import { colors } from "@/src/constants/colors";
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

const handlePressContact = async (item: BusinessContactItem) => {
  if (!item.actionUrl) return;

  const canOpen = await Linking.canOpenURL(item.actionUrl);

  if (canOpen) {
    await Linking.openURL(item.actionUrl);
  }
};

export default function BusinessAboutSection({ businessName, about }: Props) {
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);
  const [shouldShowFullAddress, setShouldShowFullAddress] = useState(false);
  const [areHoursExpanded, setAreHoursExpanded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTextTruncated, setIsTextTruncated] = useState(false);

  const shouldShowReadMore = isTextTruncated || isExpanded;

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
            const isHoursRow =
              item.type === "hours" && Boolean(about.openingHours?.length);

            const isAddressRow = item.type === "address";

            return (
              <View key={item.id}>
                <BusinessExpandableInfoRow
                  icon={contactIcons[item.type]}
                  title={item.label}
                  value={item.value}
                  isLinkValue={isAddressRow && isAddressExpanded}
                  numberOfLines={
                    isAddressRow && !shouldShowFullAddress ? 1 : undefined
                  }
                  onPress={
                    !isHoursRow && !isAddressRow && item.actionUrl
                      ? () => handlePressContact(item)
                      : undefined
                  }
                  statusText={
                    isHoursRow
                      ? about.isOpen
                        ? "Open now"
                        : "Closed"
                      : undefined
                  }
                  statusColor={
                    isHoursRow
                      ? about.isOpen
                        ? colors.primaryGreen
                        : "#D9534F"
                      : undefined
                  }
                  isLast={isLastItem}
                  isExpanded={
                    isHoursRow
                      ? areHoursExpanded
                      : isAddressRow
                        ? isAddressExpanded
                        : false
                  }
                  onToggle={
                    isHoursRow
                      ? () => setAreHoursExpanded((value) => !value)
                      : isAddressRow
                        ? () => {
                            if (isAddressExpanded) {
                              setShouldShowFullAddress(false);
                              setIsAddressExpanded(false);
                              return;
                            }

                            setIsAddressExpanded(true);

                            requestAnimationFrame(() => {
                              setShouldShowFullAddress(true);
                            });
                          }
                        : undefined
                  }
                  onPressValue={
                    isAddressRow && isAddressExpanded
                      ? () => handlePressContact(item)
                      : undefined
                  }
                >
                  {isHoursRow
                    ? about.openingHours?.map((hour) => (
                        <View key={hour.id} style={styles.hoursRow}>
                          <Text style={styles.hoursDay}>{hour.day}</Text>
                          <Text style={styles.hoursValue}>{hour.hours}</Text>
                        </View>
                      ))
                    : null}
                </BusinessExpandableInfoRow>
              </View>
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
