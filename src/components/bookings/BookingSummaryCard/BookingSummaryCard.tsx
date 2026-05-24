import AppText from "@/src/components/ui/AppText/AppText";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import React from "react";
import { View } from "react-native";
import { createStyles } from "./BookingSummaryCard.styles";

type Props = {
  businessName: string;
  serviceName: string;
  specialistName: string;
  date: string;
  time: string;
  price: string;
  customerName: string;
  phoneNumber: string;
};

export default function BookingSummaryCard({
  businessName,
  serviceName,
  specialistName,
  date,
  time,
  price,
  customerName,
  phoneNumber,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      <AppText style={styles.title}>Booking summary</AppText>

      <View style={styles.rows}>
        <SummaryRow label="Business" value={businessName} />
        <SummaryRow label="Service" value={serviceName} />
        <SummaryRow label="Specialist" value={specialistName} />
        <SummaryRow label="Date" value={date} />
        <SummaryRow label="Time" value={time} />
        <SummaryRow label="Price" value={price} />
        <SummaryRow label="Name" value={customerName} />
        <SummaryRow label="Phone" value={phoneNumber} />
      </View>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.row}>
      <AppText style={styles.label}>{label}</AppText>
      <AppText style={styles.value}>{value}</AppText>
    </View>
  );
}
