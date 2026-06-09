import { BookingStepper } from "@/src/components/bookings";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppDatePickerCard from "@/src/components/ui/AppDatePickerCard/AppDatePickerCard";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import AppTimeSlot from "@/src/components/ui/AppTimeSlot/AppTimeSlot";
import type { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useAvailability } from "@/src/features/bookings/hooks/useAvailability";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type DateOption = {
  id: string;
  date: Date;
  isoDate: string;
  day: string;
  dayNumber: string;
  month: string;
  disabled: boolean;
};

const formatIsoDate = (date: Date) => date.toISOString().split("T")[0];

const buildDateOptions = (): DateOption[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 8 }).map((_, index) => {
    const offset = index - 1;
    const date = new Date(today);
    date.setDate(today.getDate() + offset);

    const disabled = date < today;

    return {
      id: formatIsoDate(date),
      date,
      isoDate: formatIsoDate(date),
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: date.toLocaleDateString("en-US", { day: "2-digit" }),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      disabled,
    };
  });
};

export default function ChooseDateScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const {
    businessId,
    serviceId,
    serviceName,
    price,
    specialistId,
    specialistName,
    promotionId,
    promoCode,
    discountLabel,
  } = useLocalSearchParams<{
    businessId?: string;
    serviceId?: string;
    serviceName?: string;
    price?: string;
    specialistId?: string;
    specialistName?: string;
    promotionId?: string;
    promoCode?: string;
    discountLabel?: string;
  }>();

  const dateOptions = useMemo(() => buildDateOptions(), []);
  const firstAvailableDate = dateOptions.find((option) => !option.disabled);
  const [selectedDate, setSelectedDate] = useState<string>(
    firstAvailableDate?.isoDate ?? formatIsoDate(new Date()),
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    id: string;
    time: string;
  } | null>(null);

  const {
    slots,
    isLoading: isAvailabilityLoading,
    error: availabilityError,
  } = useAvailability(
    businessId && serviceId && specialistId && selectedDate
      ? {
          businessId,
          serviceId,
          specialistId,
          date: selectedDate,
        }
      : null,
  );

  const handleSelectTime = (timeSlotId: string, time: string) => {
    setSelectedTimeSlot({ id: timeSlotId, time });
  };

  const handleNext = () => {
    if (!businessId || !serviceId || !selectedTimeSlot) return;

    router.push({
      pathname: "/bookings/personal-details",
      params: {
        businessId,
        serviceId,
        serviceName,
        price,
        specialistId,
        specialistName,
        date: selectedDate,
        timeSlotId: selectedTimeSlot.id,
        time: selectedTimeSlot.time,
        promotionId,
        promoCode,
        discountLabel,
      },
    });
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  return (
    <AppScreen style={styles.container}>
      <View style={styles.content}>
        <BookingStepper currentStep={3} />

        <View style={styles.header}>
          <AppText style={styles.title}>Choose date and time</AppText>
          <AppText style={styles.subtitle}>
            Select an available date and appointment time.
          </AppText>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Date</AppText>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateList}
            >
              {dateOptions.map((option) => (
                <AppDatePickerCard
                  key={option.id}
                  day={option.day}
                  date={option.dayNumber}
                  month={option.month}
                  selected={selectedDate === option.isoDate}
                  disabled={option.disabled}
                  onPress={() => handleSelectDate(option.isoDate)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Available times</AppText>
            {isAvailabilityLoading && (
              <AppText style={styles.emptyText}>
                Loading available times...
              </AppText>
            )}

            {!!availabilityError && (
              <AppText style={styles.emptyText}>
                {availabilityError.isNetworkError
                  ? "No internet connection. Check your connection."
                  : availabilityError.message}
              </AppText>
            )}

            <View style={styles.timeGrid}>
              {slots.map((slot) => (
                <View key={slot.id} style={styles.timeSlotWrap}>
                  <AppTimeSlot
                    label={slot.time}
                    disabled={!slot.isAvailable}
                    selected={selectedTimeSlot?.id === slot.id}
                    onPress={() => handleSelectTime(slot.id, slot.time)}
                  />
                </View>
              ))}
            </View>

            {!slots.some((slot) => slot.isAvailable) && (
              <AppText style={styles.emptyText}>
                No available times for this date. Please choose another date.
              </AppText>
            )}
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Next"
          disabled={!selectedTimeSlot}
          onPress={handleNext}
        />
      </View>
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      gap: spacing.lg,
    },
    scroll: {
      flex: 1,
    },
    footer: {
      paddingTop: spacing.sm,
      paddingBottom: spacing.xl,
      backgroundColor: colors.background,
    },
    header: {
      gap: spacing.xs,
    },
    title: {
      fontSize: 24,
      fontWeight: "900",
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSecondary,
    },
    section: {
      gap: spacing.md,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    dateList: {
      gap: spacing.sm,
      paddingRight: spacing.lg,
    },
    timeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    timeSlotWrap: {
      width: "30%",
      minWidth: 92,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textMuted,
    },
    list: {
      gap: spacing.md,
      paddingBottom: spacing.md,
    },
    scrollContent: {
      gap: spacing.lg,
      paddingBottom: spacing.md,
    },
  });
}
