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
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";

const PERSONAL_NOTIFICATION_TABS: {
  label: string;
  value: NotificationTab;
}[] = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Updates", value: "updates" },
];

const BUSINESS_NOTIFICATION_TABS: {
  label: string;
  value: NotificationTab;
}[] = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Activity", value: "activity" },
  { label: "Promos", value: "promotions" },
  { label: "Updates", value: "updates" },
];

const EMPTY_STATE_BY_TAB: Record<
  NotificationTab,
  { title: string; description: string }
> = {
  all: {
    title: "No notifications yet",
    description: "Updates about your activity will appear here.",
  },
  unread: {
    title: "No unread notifications",
    description: "You are all caught up.",
  },
  activity: {
    title: "No activity yet",
    description: "Reviews, recommendations, and followers will appear here.",
  },
  promotions: {
    title: "No promotions yet",
    description: "Business offers and promo updates will appear here.",
  },
  updates: {
    title: "No updates yet",
    description: "System and business updates will appear here.",
  },
};

export default function NotificationsScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const isGuest = useAuthStore((state) => state.isGuest);
  const activeAccount = useActiveAccount();

  useEffect(() => {
    useNotificationsStore
      .getState()
      .setActiveAccountType(activeAccount.kind);
  }, [activeAccount.kind]);

  const [activeTab, setActiveTab] = useState<NotificationTab>("all");

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
          { title: "New", data: newNotifications },
          { title: "Earlier", data: earlierNotifications },
        ].filter((section) => section.data.length > 0);

  const emptyState = EMPTY_STATE_BY_TAB[activeTab];

  const handleRegisterPress = () => {
    router.push({
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
          title="Notifications"
          titleSubtitle="Stay updated with BridgeUA"
          headerInnerStyle={styles.guestHeaderInner}
        />

        <View style={styles.guestContent}>
          <AppEmptyState
            title="Register to get notifications"
            description="Create an account to receive updates, promotions, follows, and activity notifications."
            actionLabel="Register to BridgeUA"
            onPressAction={handleRegisterPress}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Notifications"
        titleSubtitle="Stay updated with BridgeUA"
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
            Mark all as read
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
      marginBottom: spacing.sm,
    },
  });
}
