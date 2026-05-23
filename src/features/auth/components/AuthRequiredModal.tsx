import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { Modal, Pressable, StyleSheet, View } from "react-native";

type AuthRequiredModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function AuthRequiredModal({
  visible,
  onClose,
  onConfirm,
}: AuthRequiredModalProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card}>
          <AppText style={styles.title}>
            Become a user to unlock this feature
          </AppText>

          <AppText style={styles.description}>
            Only registered users can follow businesses, book services, leave
            reviews, and see promotions from businesses they follow.
          </AppText>

          <View style={styles.actions}>
            <View style={styles.secondaryAction}>
              <AppButton
                title="Maybe later"
                variant="ghost"
                onPress={onClose}
              />
            </View>

            <View style={styles.primaryAction}>
              <AppButton title="Become a user" onPress={onConfirm} />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
      backgroundColor: "rgba(0, 0, 0, 0.60)",
    },

    card: {
      borderRadius: 28,
      padding: spacing.xl,
      backgroundColor: colors.primaryGreenSoft,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.md,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 10,
},
      shadowOpacity: 0.12,
      shadowRadius: 24,

      elevation: 10,
    },

    title: {
      fontSize: 20,
      lineHeight: 26,
      fontWeight: "800",
      color: colors.textPrimary,
    },

    description: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
    },

    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    secondaryAction: {
      flex: 1,
    },

    primaryAction: {
      flex: 1.2,
    },
  });
}
