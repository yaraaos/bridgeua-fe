import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import { AppColors } from "@/src/constants/colors";
import { radius } from "@/src/constants/radius";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const SECTIONS = [
  {
    heading: "Acceptance of Terms",
    body: "By accessing or using BridgeUA, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use the app. We reserve the right to update these terms at any time, with continued use constituting acceptance.",
  },
  {
    heading: "Use of the App",
    body: "You agree to use BridgeUA only for lawful purposes and in accordance with these terms. You must not attempt to gain unauthorised access to any part of the platform or interfere with its normal operation. We reserve the right to suspend or terminate accounts that violate these terms.",
  },
  {
    heading: "User Content",
    body: "You retain ownership of any content you submit, including reviews and profile information, but grant BridgeUA a licence to display and use that content within the platform. You are responsible for ensuring your content does not infringe third-party rights or contain unlawful material. We may remove content that violates our community guidelines.",
  },
  {
    heading: "Bookings & Payments",
    body: "BridgeUA facilitates bookings between users and businesses but is not a party to those transactions. Payment processing is handled by third-party providers; their terms and conditions apply. Cancellation and refund policies are set by individual businesses and displayed at the time of booking.",
  },
  {
    heading: "Termination",
    body: "Either party may terminate use of the platform at any time. We may suspend or delete your account if you breach these terms or engage in conduct harmful to the platform or its users. Upon termination, your right to use BridgeUA ceases immediately.",
  },
  {
    heading: "Contact",
    body: "For questions or concerns about these Terms of Service, please contact us at support@bridgeua.com. We aim to respond to all enquiries within 5 business days. For urgent matters, please indicate the urgency in the subject line of your message.",
  },
];

export default function TermsScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const router = useRouter();

  return (
    <View style={styles.safeArea}>
      <ScreenHeader title="Terms of Service" onBack={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last updated: January 2025</Text>

        {SECTIONS.map((section) => (
          <View key={section.heading} style={styles.section}>
            <Text style={styles.heading}>{section.heading}</Text>
            <Text style={styles.body}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
    },
    lastUpdated: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: spacing.lg,
    },
    section: {
      marginBottom: spacing.lg,
    },
    heading: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    body: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 22,
    },
  });
}
