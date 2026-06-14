import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import { NotificationItem } from "@/src/components/notifications";
import AppEmptyState from "@/src/components/ui/AppEmptyState/AppEmptyState";
import AppTabsPills from "@/src/components/ui/AppTabsPills/AppTabsPills";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import {
  useMarkAsRead,
  useNotifications,
  type AppNotification,
  type NotificationTab,
} from "@/src/features/notifications";
import { getNotificationNavigation } from "@/src/features/notifications/utils/notification-navigation";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useActiveAccount } from "@/src/store/account.store";
import { useAuthStore } from "@/src/store/auth.store";
import { useNotificationsStore } from "@/src/store/notifications.store";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";


export default function NotificationsScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const isGuest = useAuthStore((state) => state.isGuest);
  const activeAccount = useActiveAccount();
  const { tab } = useLocalSearchParams<{ tab?: string }>();

  const PERSONAL_NOTIFICATION_TABS: { label: string; value: NotificationTab }[] = [
    { label: t("notifications.filters.all"), value: "all" },
    { label: t("notifications.filters.unread"), value: "unread" },
    { label: t("notifications.filters.updates"), value: "updates" },
  ];

  const BUSINESS_NOTIFICATION_TABS: { label: string; value: NotificationTab }[] = [
    { label: t("notifications.filters.all"), value: "all" },
    { label: t("notifications.filters.unread"), value: "unread" },
    { label: t("notifications.filters.activity"), value: "activity" },
    { label: t("notifications.filters.promos"), value: "promotions" },
    { label: t("notifications.filters.updates"), value: "updates" },
  ];

  useEffect(() => {
    if (activeAccount) {
      useNotificationsStore.getState().setActiveAccountType(activeAccount.kind);
    }
  }, [activeAccount, activeAccount?.kind]);

  const [activeTab, setActiveTab] = useState<NotificationTab>("all");

  useFocusEffect(
    useCallback(() => {
      if (tab === "unread") {
        setActiveTab("unread");
      }
    }, [tab])
  );

  const {
    newNotifications,
    earlierNotifications,
    notifications,
    activeAccountType,
    isLoading,
  } = useNotifications(activeTab);

  const visibleTabs =
    activeAccountType === "personal"
      ? PERSONAL_NOTIFICATION_TABS
      : BUSINESS_NOTIFICATION_TABS;

  const { markOne, markAll } = useMarkAsRead();

  const sections =
    activeTab === "unread"
      ? notifications.length > 0
        ? [{ title: "", data: notifications }]
        : []
      : [
          { title: t("notifications.groups.new"), data: newNotifications },
          { title: t("notifications.groups.earlier"), data: earlierNotifications },
        ].filter((section) => section.data.length > 0);

  const emptyStateMap: Record<NotificationTab, { title: string; description: string }> = {
    all: { title: t("notifications.empty.all.title"), description: t("notifications.empty.all.description") },
    unread: { title: t("notifications.empty.unread.title"), description: t("notifications.empty.unread.description") },
    activity: { title: t("notifications.empty.activity.title"), description: t("notifications.empty.activity.description") },
    promotions: { title: t("notifications.empty.promos.title"), description: t("notifications.empty.promos.description") },
    updates: { title: t("notifications.empty.updates.title"), description: t("notifications.empty.updates.description") },
  };
  const emptyState = emptyStateMap[activeTab];

  const handleRegisterPress = () => {
    router.replace({
      pathname: "/auth/sign-in",
      params: {
        source: "guest_notifications_tab",
        action: "notification",
      },
    });
  };

  const handlePressNotification = (item: AppNotification) => {
    markOne(item.id);

    const navigation = getNotificationNavigation(item);

    if (!navigation) return;

    router.push(navigation as never);
  };

  if (isGuest) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title={t("notifications.title")}
          titleSubtitle={t("notifications.subtitle")}
          headerInnerStyle={styles.guestHeaderInner}
        />

        <View style={styles.guestContent}>
          <AppEmptyState
            title={t("notifications.guest.title")}
            description={t("notifications.guest.description")}
            actionLabel={t("notifications.guest.action")}
            onPressAction={handleRegisterPress}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={t("notifications.title")}
        titleSubtitle={t("notifications.subtitle")}
        headerInnerStyle={styles.headerInner}
        bottomSlot={
          <>
            <View style={styles.tabsPillsWrap}>
              <AppTabsPills
                tabs={visibleTabs}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
            </View>
          </>
        }
      />
      {activeTab === "unread" && notifications.length > 0 ? (
        <View style={styles.unreadSectionHeader}>
          <Text style={styles.markAllText} onPress={markAll}>
            {t("notifications.markAllAsRead")}
          </Text>
        </View>
      ) : null}
      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="small" color={colors.primaryGreen} />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            notifications.length === 0 && styles.emptyContent,
          ]}
          renderSectionHeader={({ section }) =>
            section.title ? (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.itemWrap}>
              <NotificationItem item={item} onPress={handlePressNotification} />
            </View>
          )}
          ListEmptyComponent={
            <AppEmptyState
              title={emptyState.title}
              description={emptyState.description}
            />
          }
        />
      )}
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    loaderWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    guestContent: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
    },

    markAllText: {
      fontSize: 13,
      lineHeight: 16,
      fontWeight: "800",
      color: colors.primaryGreen,
      paddingHorizontal: spacing.lg,
    },

    tabsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.sm,
    },

    tabsPillsWrap: {
      flex: 1,
    },
    headerInner: {
      height: 154,
    },

    guestHeaderInner: {
      paddingHorizontal: spacing.lg,
    },

    listContent: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
    },

    emptyContent: {
      flexGrow: 1,
      justifyContent: "center",
    },

    sectionHeader: {
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
      backgroundColor: colors.background,
    },
    unreadSectionHeader: {
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
      backgroundColor: colors.background,
      alignItems: "flex-end",
    },

    sectionTitle: {
      fontSize: 13,
      lineHeight: 16,
      fontWeight: "800",
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },
    itemWrap: {
      marginBottom: 6,
    },
  });
}
