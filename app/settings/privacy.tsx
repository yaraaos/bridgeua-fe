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
    heading: "Data We Collect",
    body: "We collect information you provide directly, such as your name, email address, and profile details. We also collect usage data such as pages visited, features used, and device information. Location data may be collected when you use map or search features, with your permission.",
  },
  {
    heading: "How We Use Your Data",
    body: "Your data is used to provide and improve the BridgeUA service, including personalised recommendations and booking management. We may use your contact details to send service-related notifications and, with your consent, promotional messages. Aggregated and anonymised data may be used for analytics and product development.",
  },
  {
    heading: "Data Sharing",
    body: "We do not sell your personal data to third parties. We may share data with service providers who assist us in operating the platform, subject to confidentiality obligations. We may also disclose data when required by law or to protect the rights and safety of our users.",
  },
  {
    heading: "Your Rights",
    body: "You have the right to access, correct, or delete the personal data we hold about you. You may withdraw consent for optional data processing at any time through your account settings. To exercise any of these rights, please contact us at support@bridgeua.com.",
  },
  {
    heading: "Contact",
    body: "If you have questions about this Privacy Policy or how we handle your data, please reach out to our team at support@bridgeua.com. We aim to respond to all privacy-related enquiries within 5 business days. This policy may be updated periodically; continued use of the app constitutes acceptance of any changes.",
  },
];

export default function PrivacyScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const router = useRouter();

  return (
    <View style={styles.safeArea}>
      <ScreenHeader title="Privacy Policy" onBack={() => router.back()} />

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
