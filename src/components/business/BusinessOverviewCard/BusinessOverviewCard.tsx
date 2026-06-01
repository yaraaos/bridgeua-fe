import BusinessExpandableInfoRow from "@/src/components/business/BusinessExpandableInfoRow";
import BusinessSocialLinksSection from "@/src/components/business/BusinessSocialLinksSection";
import type {
  BusinessContactItem,
  BusinessContactType,
  BusinessDetails,
  BusinessSocialLink,
} from "@/src/features/businesses/types/business.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Linking, Text, View } from "react-native";
import { createStyles } from "./BusinessOverviewCard.styles";

type Props = {
  business: BusinessDetails;
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

const handlePressContact = async (item: BusinessContactItem) => {
  if (!item.actionUrl) return;

  const canOpen = await Linking.canOpenURL(item.actionUrl);

  if (canOpen) {
    await Linking.openURL(item.actionUrl);
  }
};

export default function BusinessOverviewCard({ business }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [areHoursExpanded, setAreHoursExpanded] = useState(false);

  const baseOverviewContacts = business.about.contacts.filter((item) =>
    ["address", "phone"].includes(item.type),
  );

  const hasOpeningHours = Boolean(business.about.openingHours?.length);

  const overviewContacts: BusinessContactItem[] = hasOpeningHours
    ? [
        ...baseOverviewContacts,
        {
          id: "contact-hours",
          type: "hours",
          label: "Hours",
          value: "",
        },
      ]
    : baseOverviewContacts;

  const websiteUrl = business.about.contacts.find(
    (item) => item.type === "website",
  )?.actionUrl;

  const overviewSocialLinks: BusinessSocialLink[] = [
    ...(business.socialLinks?.website || websiteUrl
      ? [
          {
            id: "website",
            label: "Website",
            icon: "website" as const,
            url: business.socialLinks?.website ?? websiteUrl ?? "",
          },
        ]
      : []),

    ...(business.socialLinks?.instagram
      ? [
          {
            id: "instagram",
            label: "Instagram",
            icon: "instagram" as const,
            url: business.socialLinks.instagram,
          },
        ]
      : []),

    ...(business.socialLinks?.facebook
      ? [
          {
            id: "facebook",
            label: "Facebook",
            icon: "facebook" as const,
            url: business.socialLinks.facebook,
          },
        ]
      : []),

    ...(business.socialLinks?.telegram
      ? [
          {
            id: "telegram",
            label: "Telegram",
            icon: "telegram" as const,
            url: business.socialLinks.telegram,
          },
        ]
      : []),

    ...(business.socialLinks?.whatsapp
      ? [
          {
            id: "whatsapp",
            label: "WhatsApp",
            icon: "whatsapp" as const,
            url: business.socialLinks.whatsapp,
          },
        ]
      : []),

    ...(business.about.socialLinks ?? []).filter(
      (item) =>
        item.icon !== "telegram" &&
        item.icon !== "instagram" &&
        item.icon !== "whatsapp" &&
        item.icon !== "website",
    ),
  ];

  return (
    <>
      <View style={styles.container}>
        {overviewContacts.map((item, index) => {
          const isLastItem = index === overviewContacts.length - 1;
          const isHoursRow =
            item.type === "hours" &&
            Boolean(business.about.openingHours?.length);

          return (
            <BusinessExpandableInfoRow
              key={item.id}
              icon={contactIcons[item.type]}
              title={undefined}
              value={item.value}
              isLast={isLastItem}
              numberOfLines={undefined}
              onPress={
                !isHoursRow && item.actionUrl
                  ? () => handlePressContact(item)
                  : undefined
              }
              statusText={
                isHoursRow
                  ? business.about.isOpen
                    ? `Open now${business.about.closesAt ? `  ·  Closes at ${business.about.closesAt}` : ''}`
                    : `Closed${business.about.opensAt ? `  ·  Opens at ${business.about.opensAt}` : ''}`
                  : undefined
              }
              statusColor={
                isHoursRow
                  ? (business.about.isOpen && business.about.closesAt) ||
                    (!business.about.isOpen && business.about.opensAt)
                    ? colors.white
                    : business.about.isOpen
                      ? colors.primaryGreen
                      : "#D9534F"
                  : undefined
              }
              isExpanded={isHoursRow ? areHoursExpanded : false}
              onToggle={
                isHoursRow
                  ? () => setAreHoursExpanded((value) => !value)
                  : undefined
              }
            >
              {isHoursRow
                ? business.about.openingHours?.map((hour, index, array) => (
                    <View
                      key={hour.id}
                      style={[
                        styles.hoursRow,
                        index === array.length - 1 && styles.hoursRowLast,
                      ]}
                    >
                      <Text style={styles.hoursDay}>{hour.day}</Text>
                      <Text style={styles.hoursValue}>{hour.hours}</Text>
                    </View>
                  ))
                : null}
            </BusinessExpandableInfoRow>
          );
        })}
      </View>
      <BusinessSocialLinksSection socialLinks={overviewSocialLinks} />
    </>
  );
}
