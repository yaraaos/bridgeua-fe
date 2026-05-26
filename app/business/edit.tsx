import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

import EditOverviewTab from "@/src/components/editBusiness/EditOverviewTab";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppTabsPills, {
  type AppTabPillItem,
} from "@/src/components/ui/AppTabsPills/AppTabsPills";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useActiveAccount } from "@/src/store/account.store";
import {
  type EditBusinessTab,
  useEditBusinessStore,
} from "@/src/store/editBusiness.store";

const TABS: AppTabPillItem<EditBusinessTab>[] = [
  { label: "Overview", value: "overview" },
  { label: "Gallery", value: "gallery" },
  { label: "Services", value: "services" },
  { label: "About", value: "about" },
];

export default function EditBusinessScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const account = useActiveAccount();

  const activeTab = useEditBusinessStore((s) => s.activeTab);
  const dirty = useEditBusinessStore((s) => s.dirty);
  const setActiveTab = useEditBusinessStore((s) => s.setActiveTab);
  const resetAll = useEditBusinessStore((s) => s.resetAll);

  const hasUnsaved = Object.values(dirty).some(Boolean);

  function handleBack() {
    if (hasUnsaved) {
      Alert.alert(
        "Unsaved changes",
        "You have unsaved changes. Are you sure you want to leave?",
        [
          { text: "Stay", style: "cancel" },
          {
            text: "Leave",
            style: "destructive",
            onPress: () => {
              resetAll();
              router.back();
            },
          },
        ]
      );
    } else {
      resetAll();
      router.back();
    }
  }

  function handlePreview() {
    router.push({ pathname: "/business/[id]", params: { id: account.id } });
  }

  return (
    <AppScreen style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.headerButton} hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.headerTitleRow}>
          <AppText style={styles.headerTitle}>Edit Business</AppText>
          {hasUnsaved && <View style={styles.dirtyDot} />}
        </View>

        <Pressable
          onPress={handlePreview}
          style={styles.headerButton}
          hitSlop={8}
        >
          <Feather name="eye" size={22} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.tabsRow}>
        <AppTabsPills
          tabs={TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </View>

      <View style={styles.content}>
        {activeTab === "overview" && <EditOverviewTab />}
        {activeTab === "gallery" && <TabPlaceholder label="Gallery" />}
        {activeTab === "services" && <TabPlaceholder label="Services" />}
        {activeTab === "about" && <TabPlaceholder label="About" />}
      </View>
    </AppScreen>
  );
}

function TabPlaceholder({ label }: { label: string }) {
  return (
    <View style={placeholderStyles.container}>
      <AppText style={placeholderStyles.text}>{label}</AppText>
    </View>
  );
}

const placeholderStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    screen: {
      padding: 0,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.background,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    headerButton: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    dirtyDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.accentOrange,
    },
    tabsRow: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
  });
}
