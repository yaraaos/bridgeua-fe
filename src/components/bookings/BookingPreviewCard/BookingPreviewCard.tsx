import AppText from "@/src/components/ui/AppText/AppText";
import type { BookingStatus } from "@/src/features/bookings/types/booking.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";
import { createStyles } from "./BookingPreviewCard.styles";

type Props = {
  businessName: string;
  serviceName: string;
  specialistName: string;
  date: string;
  time: string;
  price: string;
  status: BookingStatus;
  onPress: () => void;
  onPressRebook?: () => void;
};

export default function BookingPreviewCard({
  businessName,
  serviceName,
  specialistName,
  date,
  time,
  price,
  status,
  onPress,
  onPressRebook,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View>
      <Pressable style={styles.card} onPress={onPress}>
        <View style={styles.iconBox}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color={colors.primaryGreen}
          />
        </View>

        <View style={styles.textWrap}>
          <AppText style={styles.title} numberOfLines={1}>
            {businessName}
          </AppText>

          <AppText style={styles.description} numberOfLines={1}>
            {serviceName} · {date} at {time}
          </AppText>

          <View style={styles.metaRow}>
            <AppText style={styles.meta} numberOfLines={1}>
              {specialistName} · {price}
            </AppText>

            <View style={styles.statusBadge}>
              <AppText style={styles.statusText}>{status}</AppText>
            </View>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.textSecondary}
        />
      </Pressable>

      {onPressRebook ? (
        <Pressable style={styles.rebookButton} onPress={onPressRebook}>
          <Ionicons
            name="refresh-outline"
            size={15}
            color={colors.primaryGreen}
          />
          <AppText style={styles.rebookText}>Rebook</AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
