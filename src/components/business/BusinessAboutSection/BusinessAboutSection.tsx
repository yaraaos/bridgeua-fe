import type {
    BusinessAbout,
    BusinessAboutFeature,
    BusinessContactItem,
    BusinessContactType,
} from "@/src/features/businesses/types/business.types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    LayoutAnimation,
    Linking,
    Platform,
    Pressable,
    Text,
    UIManager,
    View,
} from "react-native";
import { styles } from "./BusinessAboutSection.styles";
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

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
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);
  const [areHoursExpanded, setAreHoursExpanded] = useState(false);
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
            const isHoursRow =
              item.type === "hours" && Boolean(about.openingHours?.length);
            const isAddressRow = item.type === "address";

            return (
              <View key={item.id}>
                <Pressable
                  style={[
                    styles.contactRow,
                    (isHoursRow && areHoursExpanded) ||
                    (isAddressRow && isAddressExpanded)
                      ? styles.contactRowExpanded
                      : null,
                    isLastItem && !areHoursExpanded && !isAddressExpanded
                      ? styles.contactRowLast
                      : null,
                  ]}
                  onPress={() => {
                    if (isHoursRow) {
                      LayoutAnimation.configureNext({
                        duration: 180,
                        update: {
                          type: LayoutAnimation.Types.easeInEaseOut,
                        },
                        delete: {
                          type: LayoutAnimation.Types.easeInEaseOut,
                          property: LayoutAnimation.Properties.opacity,
                        },
                        create: {
                          type: LayoutAnimation.Types.easeInEaseOut,
                          property: LayoutAnimation.Properties.opacity,
                        },
                      });

                      setAreHoursExpanded((value) => !value);
                      return;
                    }

                    if (isAddressRow) {
                      LayoutAnimation.configureNext({
                        duration: 180,
                        update: {
                          type: LayoutAnimation.Types.easeInEaseOut,
                        },
                        delete: {
                          type: LayoutAnimation.Types.easeInEaseOut,
                          property: LayoutAnimation.Properties.opacity,
                        },
                        create: {
                          type: LayoutAnimation.Types.easeInEaseOut,
                          property: LayoutAnimation.Properties.opacity,
                        },
                      });

                      setIsAddressExpanded((value) => !value);
                      return;
                    }

                    handlePressContact(item);
                  }}
                  disabled={!item.actionUrl && !isHoursRow && !isAddressRow}
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
                      numberOfLines={
                        isAddressRow && !isAddressExpanded ? 1 : undefined
                      }
                      ellipsizeMode="tail"
                    >
                      {item.value}
                    </Text>
                  </View>

                  {isHoursRow ? (
                    <Ionicons
                      name={areHoursExpanded ? "chevron-up" : "chevron-down"}
                      size={18}
                      style={styles.chevron}
                    />
                  ) : isAddressRow ? (
                    <Ionicons
                      name={isAddressExpanded ? "chevron-up" : "chevron-down"}
                      size={18}
                      style={styles.chevron}
                    />
                  ) : null}
                </Pressable>

                {isHoursRow && areHoursExpanded ? (
                  <View style={styles.hoursPanel}>
                    {about.openingHours?.map((hour) => (
                      <View key={hour.id} style={styles.hoursRow}>
                        <Text style={styles.hoursDay}>{hour.day}</Text>
                        <Text style={styles.hoursValue}>{hour.hours}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
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
