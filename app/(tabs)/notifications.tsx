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
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { router } from "expo-router";
import { useState } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";

const NOTIFICATION_TABS: { label: string; value: NotificationTab }[] = [
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

  const [activeTab, setActiveTab] = useState<NotificationTab>("all");

  const { newNotifications, earlierNotifications, notifications } =
    useNotifications(activeTab);

  const { markOne, markAll } = useMarkAsRead();

  const sections = [
    { title: "New", data: newNotifications },
    { title: "Earlier", data: earlierNotifications },
  ].filter((section) => section.data.length > 0);

  const emptyState = EMPTY_STATE_BY_TAB[activeTab];

  const handlePressNotification = (item: AppNotification) => {
    markOne(item.id);

    if (item.targetType === "business" && item.targetId) {
      router.push(`/business/${item.targetId}`);
      return;
    }

    if (item.targetType === "review" && item.targetId) {
      router.push({
        pathname: "/business/[id]",
        params: {
          id: item.targetId,
          tab: "reviews",
        },
      });
      return;
    }

    if (item.targetType === "promotion" && item.targetId) {
      router.push(`/promotions/${item.targetId}`);
      return;
    }

    if (item.targetType === "profile") {
      router.push("/profile/personal");
      return;
    }

    if (item.targetType === "settings") {
      router.push("/settings");
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Notifications"
        titleSubtitle="Stay updated with BridgeUA"
        rightSlot={
          <Text style={styles.markAllText} onPress={markAll}>
            Mark all as read
          </Text>
        }
      />

      <View style={styles.tabsWrap}>
        <AppTabsPills
          tabs={NOTIFICATION_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          notifications.length === 0 && styles.emptyContent,
        ]}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
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
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    markAllText: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: "700",
      color: colors.primaryGreen,
    },

    tabsWrap: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.sm,
      backgroundColor: colors.background,
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

    sectionTitle: {
      fontSize: 13,
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
