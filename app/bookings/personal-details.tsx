import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { BookingStepper } from "@/src/components/bookings";
import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppInput from "@/src/components/ui/AppInput/AppInput";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import type { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useProfileStore } from "@/src/store/profile.store";

export default function BookingPersonalDetailsScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const params = useLocalSearchParams<{
    businessId?: string;
    serviceId?: string;
    serviceName?: string;
    specialistId?: string;
    date?: string;
    timeSlotId?: string;
    time?: string;
    promotionId?: string;
    promoCode?: string;
  }>();

  const profile = useProfileStore((state) => state.profile);

  const initialFirstName = useMemo(() => {
    return profile.firstName || profile.displayName?.split(" ")[0] || "";
  }, [profile.displayName, profile.firstName]);

  const initialLastName = useMemo(() => {
    return (
      profile.lastName ||
      profile.displayName?.split(" ").slice(1).join(" ") ||
      ""
    );
  }, [profile.displayName, profile.lastName]);

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber ?? "");

  const canContinue =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    phoneNumber.trim().length > 0;

  const handleContinue = () => {
    if (!canContinue) return;

    router.push({
      pathname: "/bookings/confirm",
      params: {
        ...params,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
      },
    });
  };

  return (
    <AppScreen scroll style={styles.container}>
      <BookingStepper currentStep={4} />

      <View style={styles.header}>
        <AppText style={styles.title}>Personal details</AppText>
        <AppText style={styles.subtitle}>
          We’ll use these details for your booking. You can edit them for this
          appointment.
        </AppText>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <AppText style={styles.label}>Name</AppText>
          <AppInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your name"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.field}>
          <AppText style={styles.label}>Surname</AppText>
          <AppInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your surname"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.field}>
          <AppText style={styles.label}>Phone number</AppText>
          <AppInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
          />
        </View>
      </View>

      <AppButton
        title="Continue"
        disabled={!canContinue}
        onPress={handleContinue}
      />
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      paddingBottom: spacing.xl,
      gap: spacing.lg,
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
    form: {
      gap: spacing.md,
    },
    field: {
      gap: spacing.xs,
    },
    label: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textPrimary,
    },
  });
}