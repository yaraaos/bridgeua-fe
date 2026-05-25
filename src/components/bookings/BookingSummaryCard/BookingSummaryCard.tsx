import AppText from "@/src/components/ui/AppText/AppText";
import type { BookingStatus } from "@/src/features/bookings/types/booking.types";
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
  status?: BookingStatus;
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
  status,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      <AppText style={styles.title}>Booking summary</AppText>

      {status && (
        <View style={styles.statusBadge}>
          <AppText style={styles.statusText}>{status}</AppText>
        </View>
      )}

      <View style={styles.rows}>
        <SummaryRow label="Business" value={businessName} />
        <SummaryRow label="Service" value={serviceName} />
        <SummaryRow label="Specialist" value={specialistName} />
        <SummaryRow label="Date" value={date} />
        <SummaryRow label="Time" value={time} />
        <SummaryRow label="Price" value={price} />
        <SummaryRow label="Name" value={customerName} />
        <SummaryRow label="Phone" value={phoneNumber} isLast />
      </View>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={[styles.row, isLast && styles.lastRow]}>
      <AppText style={styles.label}>{label}</AppText>
      <AppText style={styles.value}>{value}</AppText>
    </View>
  );
}
