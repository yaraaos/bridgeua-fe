import { AppColors } from "@/src/constants/colors";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { saveAuthTokens } from "@/src/services/auth/tokens";
import { useAuthStore } from "@/src/store/auth.store";
import { useFollowingStore } from "@/src/store/following.store";
import { useProfileStore } from "@/src/store/profile.store";
import { useReviewsStore } from "@/src/store/reviews.store";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppLoader from "../../src/components/ui/AppLoader/AppLoader";
import AppOtpInput from "../../src/components/ui/AppOtpInput/AppOtpInput";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import { useConfirmCode } from "../../src/features/auth/hooks/useConfirmCode";
import { useResendCode } from "../../src/features/auth/hooks/useResendCode";

const OTP_LENGTH = 4;
const RESEND_SECONDS = 60;

function maskEmail(email: string) {
  const [name, domain] = email.split("@");

  if (!name || !domain) {
    return "your email";
  }

  const visible = name.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(name.length - 2, 2))}@${domain}`;
}

export default function ConfirmCodeScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email ?? "";

  const { submitConfirmCode, isLoading, apiError, setApiError } =
    useConfirmCode();
  const { submitResendCode, isLoading: isResending } = useResendCode();
  const setUser = useAuthStore((state) => state.setUser);
  const profile = useProfileStore((state) => state.profile);
  const resetFollowing = useFollowingStore((state) => state.resetFollowing);

  const clearReviews = useReviewsStore((state) => state.clearReviews);

  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [localError, setLocalError] = useState<string | null>(null);

  const maskedContact = useMemo(() => maskEmail(email), [email]);
  const canResend = timer === 0 && !isResending;

  useEffect(() => {
    if (timer === 0) return;

    const intervalId = setInterval(() => {
      setTimer((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer]);

  const handleCodeChange = (value: string) => {
    setCode(value);
    setLocalError(null);
    setApiError(null);
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    if (code.length !== OTP_LENGTH) {
      setLocalError("Enter the 4-digit code");
      return;
    }

    const response = await submitConfirmCode({ email, code });

    if (response?.verified) {
      resetFollowing();
      clearReviews();

      await saveAuthTokens(response.accessToken);

      setUser({
        id: profile.id,
        email: profile.email ?? email,
        name: profile.displayName,
      });

      router.replace("/(tabs)/home");
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;

    const response = await submitResendCode({ email });

    if (response?.success) {
      setCode("");
      setLocalError(null);
      setApiError(null);
      setTimer(RESEND_SECONDS);
    }
  };

  return (
    <AppScreen style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>Enter confirmation code</Text>
        <Text style={styles.subtitle}>
          A 4-digit code was sent to {maskedContact}
        </Text>

        <View style={styles.otpWrap}>
          <AppOtpInput
            value={code}
            onChange={handleCodeChange}
            length={OTP_LENGTH}
            error={Boolean(localError || apiError)}
          />
        </View>

        {localError ? <Text style={styles.errorText}>{localError}</Text> : null}
        {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}

        <Pressable
          onPress={handleResend}
          disabled={!canResend}
          style={styles.resendButton}
        >
          <Text style={[styles.resendText, !canResend && styles.resendMuted]}>
            {timer > 0
              ? `Resend code in ${timer}s`
              : isResending
                ? "Resending..."
                : "Resend code"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.actions}>
        {isLoading ? (
          <AppLoader />
        ) : (
          <AppButton title="Continue" onPress={handleSubmit} />
        )}
      </View>
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      justifyContent: "space-between",
      paddingVertical: 40,
    },

    center: {
      alignItems: "center",
      marginTop: 80,
    },

    title: {
      fontSize: 24,
      fontWeight: "800",
      color: colors.textPrimary,
      textAlign: "center",
    },

    subtitle: {
      marginTop: 8,
      textAlign: "center",
      color: colors.textSecondary,
    },

    otpWrap: {
      marginTop: 24,
    },

    errorText: {
      marginTop: 12,
      fontSize: 13,
      color: colors.error,
      textAlign: "center",
    },

    resendButton: {
      marginTop: 20,
    },

    resendText: {
      color: colors.primaryGreen,
      fontSize: 13,
      fontWeight: "700",
    },

    resendMuted: {
      color: colors.textMuted,
    },

    actions: {
      gap: 12,
    },
  });
}
