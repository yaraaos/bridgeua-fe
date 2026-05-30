import { Feather } from "@expo/vector-icons";
import { usePreventRemove } from '@react-navigation/core';
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Alert, Pressable, StyleSheet, View } from "react-native";

import EditAboutTab from "@/src/components/editBusiness/EditAboutTab";
import EditGalleryTab from "@/src/components/editBusiness/EditGalleryTab";
import EditOverviewTab from "@/src/components/editBusiness/EditOverviewTab";
import EditServicesTab from "@/src/components/editBusiness/EditServicesTab";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppTabsPills, {
  type AppTabPillItem,
} from "@/src/components/ui/AppTabsPills/AppTabsPills";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useMyBusinessProfile } from "@/src/features/businesses";
import { type DayOfWeek } from "@/src/features/businesses/types/editBusiness.types";
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

  const { business } = useMyBusinessProfile();

  const { tab } = useLocalSearchParams<{ tab?: string }>();

  const activeTab = useEditBusinessStore((s) => s.activeTab);
  const dirty = useEditBusinessStore((s) => s.dirty);
  const setActiveTab = useEditBusinessStore((s) => s.setActiveTab);
  const resetAll = useEditBusinessStore((s) => s.resetAll);
  const setOverviewDraft = useEditBusinessStore((s) => s.setOverviewDraft);
  const setGalleryDraft = useEditBusinessStore((s) => s.setGalleryDraft);
  const setServicesDraft = useEditBusinessStore((s) => s.setServicesDraft);
  const setAboutDraft = useEditBusinessStore((s) => s.setAboutDraft);

  useEffect(() => {
    if (
      tab === "services" ||
      tab === "gallery" ||
      tab === "overview" ||
      tab === "about"
    ) {
      setActiveTab(tab as EditBusinessTab);
    }
  }, [tab, setActiveTab]);

  useEffect(() => {
    if (!business) return;

    setOverviewDraft({
      name: business.name ?? "",
      category: business.category ?? "",
      avatarUrl: business.avatarUrl ?? undefined,
      address: business.address ?? "",
      postalCode: business.zipCode ?? "",
      city: business.city ?? "",
      state: business.state ?? "",
      phone: business.phone ?? "",
      socialLinks: {
        website: business.socialLinks?.website ?? "",
        instagram: business.socialLinks?.instagram ?? "",
        facebook: business.socialLinks?.facebook ?? "",
        telegram: business.socialLinks?.telegram ?? "",
        whatsapp: business.socialLinks?.whatsapp ?? "",
      },
      hours:
        business.businessHours?.map((h) => {
          const DAY_NAMES: DayOfWeek[] = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ];
          return {
            day: DAY_NAMES[h.day] ?? "monday",
            isOpen: !h.isClosed,
            openTime: h.opensAt ?? "09:00",
            closeTime: h.closesAt ?? "18:00",
          };
        }) ?? [],
    });

    setGalleryDraft({
      photos:
        business.images?.map((img) => ({
          id: img.id,
          url: img.url,
          isLocal: false,
        })) ?? [],
      defaultPhotoIds:
        business.images?.filter((img) => img.isDefault).map((img) => img.id) ??
        [],
      deletedPhotoIds: [],
    });

    setServicesDraft({
      services:
        business.services?.map((svc) => ({
          id: svc.id,
          name: svc.name,
          duration: svc.duration ?? "",
          price: String(svc.price ?? ""),
        })) ?? [],
    });

    setAboutDraft({
      description: business.about?.description ?? "",
      languages: business.about?.languages ?? [],
      amenities: business.about?.amenities?.map((a) => a.label) ?? [],
    });
  }, [business?.id]);

  const hasUnsaved = Object.values(dirty).some(Boolean);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!hasUnsaved) {
      pulseAnim.setValue(1);
      return;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();
    return () => pulse.stop();
  }, [hasUnsaved]);

  usePreventRemove(hasUnsaved, ({ data }) => {
    Alert.alert(
      'Unsaved changes',
      'You have unsaved changes. Are you sure you want to leave?',
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            resetAll();
            router.dismiss();
          },
        },
      ],
    );
  });

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
        ],
      );
    } else {
      resetAll();
      router.back();
    }
  }

  function handlePreview() {
    if (!business?.id) return;
    router.push({
      pathname: "/business/[id]",
      params: { id: business.id, preview: "edit" },
    });
  }

  return (
    <AppScreen style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.headerButton} hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.textPrimary} />
        </Pressable>

        <AppText style={styles.headerTitle}>Edit Business</AppText>

        <Pressable
          onPress={handlePreview}
          style={styles.headerButton}
          hitSlop={8}
        >
          <View style={styles.previewButtonInner}>
            <AppText style={[styles.previewLabel, !hasUnsaved && styles.previewLabelHidden]}>
              Preview
            </AppText>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Feather
                name="eye"
                size={22}
                color={hasUnsaved ? colors.accentOrange : colors.textPrimary}
              />
            </Animated.View>
          </View>
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
        {activeTab === "overview" && (
          <EditOverviewTab business={business} businessId={business?.id} />
        )}
        {activeTab === "gallery" && (
          <EditGalleryTab business={business} businessId={business?.id} />
        )}
        {activeTab === "services" && (
          <EditServicesTab business={business} businessId={business?.id} />
        )}
        {activeTab === "about" && <EditAboutTab business={business} />}
      </View>
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    screen: {
      padding: 0,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.background,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    headerButton: {
      height: 36,
      minWidth: 36,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.textPrimary,
      position: 'absolute',
      left: 0,
      right: 0,
      textAlign: 'center',
    },
    tabsRow: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    previewButtonInner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    previewLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.accentOrange,
    },
    previewLabelHidden: {
      opacity: 0,
    },
  });
}
