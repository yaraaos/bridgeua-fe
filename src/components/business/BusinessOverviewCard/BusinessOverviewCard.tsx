import BusinessInfoRow from "@/src/components/business/BusinessInfoRow";
import type { BusinessDetails } from "@/src/features/businesses/types/business.types";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "./BusinessOverviewCard.styles";

type Props = {
  business: BusinessDetails;
};

export default function BusinessOverviewInfoCard({ business }: Props) {
  const hoursValue = business.isOpen
    ? `Open now · Closes at ${business.closesAt}`
    : "Closed now";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Overview</Text>

      <BusinessInfoRow
        icon="location-outline"
        title="Address"
        value={business.address}
      />

      <BusinessInfoRow
        icon="time-outline"
        title="Opening hours"
        value={hoursValue}
      />

      <BusinessInfoRow
        icon="globe-outline"
        title="Website"
        value={business.website}
      />
    </View>
  );
}