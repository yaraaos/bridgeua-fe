import { AppColors } from "@/src/constants/colors";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { saveAuthTokens } from "@/src/services/auth/tokens";
import { useAuthStore } from "@/src/store/auth.store";
import { useFollowingStore } from "@/src/store/following.store";
import { useReviewsStore } from "@/src/store/reviews.store";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppInput from "../../src/components/ui/AppInput/AppInput";
import AppLoader from "../../src/components/ui/AppLoader/AppLoader";
import AppPasswordInput from "../../src/components/ui/AppPasswordInput/AppPasswordInput";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import { useSignIn } from "../../src/features/auth/hooks/useSignIn";
import {
  SignInFormErrors,
  validateSignInForm,
} from "../../src/features/auth/validation/signIn.validation";

export default function SignInScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { submitSignIn, isLoading, apiError, setApiError } = useSignIn();
  const setUser = useAuthStore((state) => state.setUser);
  const resetFollowing = useFollowingStore((state) => state.resetFollowing);

  const clearReviews = useReviewsStore((state) => state.clearReviews);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<SignInFormErrors>({});

  const handleSubmit = async () => {
    if (isLoading) return;
    const values = { email, password };
    const validationErrors = validateSignInForm(values);

    setErrors(validationErrors);
    setApiError(null);

    if (Object.keys(validationErrors).length > 0) return;

    const response = await submitSignIn(values);

    if (response) {
      resetFollowing();
      clearReviews();

      await saveAuthTokens(response.token);

      setUser(response.user);

      router.replace("/(tabs)/home");
    }
  };

  return (
    <AppScreen scroll style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome!</Text>
      </View>

      <View style={styles.form}>
        <View>
          <AppInput
            placeholder="Email address"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setErrors((current) => ({ ...current, email: undefined }));
              setApiError(null);
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            error={Boolean(errors.email)}
            disabled={isLoading}
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
        </View>

        <View>
          <AppPasswordInput
            placeholder="Password"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setErrors((current) => ({ ...current, password: undefined }));
              setApiError(null);
            }}
            error={Boolean(errors.password)}
            disabled={isLoading}
          />
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
        </View>

        <Text
          style={styles.forgot}
          onPress={() => router.push("/auth/forgot-password")}
        >
          Forgot password?
        </Text>

        {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}

        {isLoading ? (
          <AppLoader />
        ) : (
          <AppButton title="Login" onPress={handleSubmit} />
        )}
      </View>

      <Text style={styles.footer}>
        Not a member?{" "}
        <Text
          style={styles.link}
          onPress={() => router.push("/auth/sign-up-personal")}
        >
          Register now
        </Text>
      </Text>
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      justifyContent: "center",
      gap: 24,
    },

    header: {
      alignItems: "center",
    },

    title: {
      fontSize: 34,
      fontWeight: "800",
      color: colors.primaryGreen,
    },

    form: {
      gap: 12,
    },

    forgot: {
      color: colors.primaryGreen,
      fontSize: 13,
    },

    errorText: {
      marginTop: 4,
      fontSize: 12,
      color: colors.error,
    },

    apiError: {
      fontSize: 13,
      color: colors.error,
      textAlign: "center",
    },

    footer: {
      textAlign: "center",
      color: colors.textSecondary,
    },

    link: {
      color: colors.primaryGreen,
      fontWeight: "700",
    },
  });
}
