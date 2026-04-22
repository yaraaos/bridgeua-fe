//app/auth/sign-up-personal.tsx

import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppInput from "../../src/components/ui/AppInput/AppInput";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import { colors } from "../../src/constants/colors";

export default function SignUpPersonalScreen() {
  const [agree, setAgree] = useState(false);

  return (
    <AppScreen style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Choose the type of account you want to create
          </Text>
        </View>

        <View style={styles.switchRow}>
          <Pressable style={[styles.switchTab, styles.switchTabActive]}>
            <Text style={[styles.switchText, styles.switchTextActive]}>
              Personal
            </Text>
          </Pressable>

          <Pressable
            style={styles.switchTab}
            onPress={() => router.replace("/auth/sign-up-business")}
          >
            <Text style={styles.switchText}>Business</Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          <AppInput
            placeholder="Email address"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View>
            <AppInput placeholder="Password" secureTextEntry />
            <Feather
              name="eye-off"
              size={16}
              color={colors.textMuted}
              style={styles.eyeIcon}
            />
          </View>

          <View>
            <AppInput placeholder="Confirm password" secureTextEntry />
            <Feather
              name="eye-off"
              size={16}
              color={colors.textMuted}
              style={styles.eyeIcon}
            />
          </View>

          <Pressable
            style={styles.checkboxRow}
            onPress={() => setAgree((prev) => !prev)}
          >
            <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
              {agree ? (
                <Feather name="check" size={12} color={colors.white} />
              ) : null}
            </View>

            <Text style={styles.checkboxText}>
              I’ve read and agree with the{" "}
              <Text style={styles.linkText}>Terms and Conditions</Text> and the{" "}
              <Text style={styles.linkText}>Privacy Policy</Text>.
            </Text>
          </Pressable>

          <AppButton
            title="Continue"
            onPress={() => router.push("/auth/confirm-code")}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text
              style={styles.footerLink}
              onPress={() => router.replace("/auth/sign-in")}
            >
              Sign in
            </Text>
          </Text>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 14,
  },
  headerBlock: {
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.primaryGreen,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
  },
  switchRow: {
    flexDirection: "row",
    backgroundColor: "#D4DED7",
    borderRadius: 999,
    padding: 4,
    marginBottom: 16,
  },
  switchTab: {
    flex: 1,
    minHeight: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  switchTabActive: {
    backgroundColor: colors.primaryGreen,
  },
  switchText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  switchTextActive: {
    color: colors.white,
  },
  form: {
    gap: 12,
  },
  eyeIcon: {
    position: "absolute",
    right: 14,
    top: 17,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#BFC7C1",
    backgroundColor: colors.white,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
  },
  checkboxText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
    color: colors.textSecondary,
  },
  linkText: {
    color: colors.textPrimary,
    fontWeight: "700",
  },
  footer: {
    marginTop: 18,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  footerLink: {
    color: colors.textPrimary,
    fontWeight: "700",
  },
});
