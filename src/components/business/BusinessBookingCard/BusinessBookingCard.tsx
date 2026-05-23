import { AuthRequiredModal, useRequireAuth } from "@/src/features/auth";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { createStyles } from "./BusinessBookingCard.styles";

type Props = {
  businessId: string;
};

type BookingAction = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  pathname:
    | "/bookings/choose-date"
    | "/bookings/choose-specialist"
    | "/bookings/choose-service";
};

const BOOKING_ACTIONS: BookingAction[] = [
  {
    title: "Pick date and time",
    subtitle: "Choose a time that works for you",
    icon: "calendar-outline",
    pathname: "/bookings/choose-date",
  },
  {
    title: "Choose a professional",
    subtitle: "Select who you want to book with",
    icon: "person-outline",
    pathname: "/bookings/choose-specialist",
  },
  {
    title: "Select services",
    subtitle: "Choose one or more services",
    icon: "cut-outline",
    pathname: "/bookings/choose-service",
  },
];

export default function BusinessBookingCard({ businessId }: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { isAuthModalVisible, closeAuthModal, confirmAuthModal, requireAuth } =
    useRequireAuth();

  const handlePress = (pathname: BookingAction["pathname"]) => {
    requireAuth(
      () => {
        router.push({
          pathname,
          params: { businessId },
        });
      },
      {
        action: "book",
      },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book an appointment</Text>

      <View style={styles.actions}>
        {BOOKING_ACTIONS.map((action, index) => (
          <Pressable
            key={action.pathname}
            style={[
              styles.actionRow,
              index !== 0 ? styles.actionRowBordered : null,
            ]}
            onPress={() => handlePress(action.pathname)}
          >
            <View style={styles.iconBox}>
              <Ionicons
                name={action.icon}
                size={18}
                color={colors.primaryGreen}
              />
            </View>

            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textMuted}
            />
          </Pressable>
        ))}
      </View>

      <AuthRequiredModal
        visible={isAuthModalVisible}
        onClose={closeAuthModal}
        onConfirm={confirmAuthModal}
      />
    </View>
  );
}
