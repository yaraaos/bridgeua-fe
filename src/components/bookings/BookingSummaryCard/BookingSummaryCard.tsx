import AppLabel from "@/src/components/ui/AppLabel/AppLabel";
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
  originalPrice?: string;
  discountPercentage?: number;
  discountAmount?: string;
  finalPrice?: string;
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
  originalPrice,
  discountPercentage,
  discountAmount,
  finalPrice,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      <AppText style={styles.title}>Booking summary</AppText>

      {status && (
        <AppLabel label="Confirmed" variant="confirmed" />
      )}

      <View style={styles.rows}>
        <SummaryRow label="Business" value={businessName} />
        <SummaryRow label="Service" value={serviceName} />
        <SummaryRow label="Specialist" value={specialistName} />
        <SummaryRow label="Date" value={date} />
        <SummaryRow label="Time" value={time} />
        {originalPrice && discountAmount && finalPrice ? (
          <>
            <SummaryRow label="Original price" value={originalPrice} />
            <SummaryRow label={`Discount (${discountPercentage}%)`} value={`-${discountAmount}`} />
            <SummaryRow label="Final price" value={finalPrice} />
          </>
        ) : (
          <SummaryRow label="Price" value={price} />
        )}
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
