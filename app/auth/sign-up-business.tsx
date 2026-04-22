//app/auth/sign-up-business.tsx

import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import AppScreen from "../../src/components/ui/AppScreen/AppScreen";
import AppButton from "../../src/components/ui/AppButton/AppButton";
import AppInput from "../../src/components/ui/AppInput/AppInput";
import { colors } from "../../src/constants/colors";

const CATEGORIES = [
  "Beauty",
  "Restaurant",
  "Automotive",
  "Health & Medical",
  "Home & Repair",
  "Education",
  "Other",
];

export default function SignUpBusinessScreen() {
  const [agree, setAgree] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Beauty");

  return (
    <AppScreen scroll style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Choose the type of account you want to create
          </Text>
        </View>

        <View style={styles.switchRow}>
          <Pressable
            style={styles.switchTab}
            onPress={() => router.replace("/auth/sign-up-personal")}
          >
            <Text style={styles.switchText}>Personal</Text>
          </Pressable>

          <Pressable style={[styles.switchTab, styles.switchTabActive]}>
            <Text style={[styles.switchText, styles.switchTextActive]}>Business</Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          <AppInput placeholder="Business name" />

          <View style={styles.row}>
            <View style={styles.half}>
              <AppInput placeholder="City" />
            </View>
            <View style={styles.half}>
              <AppInput placeholder="Country" />
            </View>
          </View>

          <AppInput placeholder="Street Address" />

          <View>
            <Text style={styles.sectionLabel}>Description</Text>
            <AppInput
              placeholder="Tell the community about your business..."
              multiline
              style={styles.textarea}
            />
          </View>

          <View>
            <Text style={styles.sectionLabel}>Website</Text>
            <AppInput placeholder="https://shop.com" autoCapitalize="none" />
          </View>

          <View>
            <Text style={styles.sectionLabel}>Category</Text>
            <View style={styles.categoriesWrap}>
              {CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                return (
                  <Pressable
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    style={[styles.categoryChip, active && styles.categoryChipActive]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        active && styles.categoryChipTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <AppInput
            placeholder="Email address"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View>
            <AppInput placeholder="Password" secureTextEntry />
            <Feather name="eye-off" size={16} color={colors.textMuted} style={styles.eyeIcon} />
          </View>

          <View>
            <AppInput placeholder="Confirm password" secureTextEntry />
            <Feather name="eye-off" size={16} color={colors.textMuted} style={styles.eyeIcon} />
          </View>

          <Pressable style={styles.checkboxRow} onPress={() => setAgree((prev) => !prev)}>
            <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
              {agree ? <Feather name="check" size={12} color={colors.white} /> : null}
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
            <Text style={styles.footerLink} onPress={() => router.replace("/auth/sign-in")}>
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
    paddingBottom: 24,
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 8,
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
  row: {
    flexDirection: "row",
    gap: 10,
  },
  half: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  textarea: {
    minHeight: 86,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  categoriesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    minHeight: 32,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#EFEFEA",
    borderWidth: 1,
    borderColor: "#E3E3DD",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryChipActive: {
    backgroundColor: colors.primaryGreenSoft,
    borderColor: colors.primaryGreen,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  categoryChipTextActive: {
    color: colors.primaryGreenDark,
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