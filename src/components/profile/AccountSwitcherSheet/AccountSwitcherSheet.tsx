import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import AppAvatar from "@/src/components/ui/AppAvatar";
import AppText from "@/src/components/ui/AppText/AppText";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import {
  useAccountStore,
  type AccountSummary,
} from "@/src/store/account.store";
import { useAuthStore } from "@/src/store/auth.store";
import { useNotificationsStore } from "@/src/store/notifications.store";

import { createStyles } from "./AccountSwitcherSheet.styles";

type Props = {
  onClose: () => void;
  onSelectAccount?: (account: AccountSummary) => void;
};

export default function AccountSwitcherSheet({
  onClose,
  onSelectAccount,
}: Props) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [isSwitching, setIsSwitching] = useState(false);

  const accounts = useAccountStore((s) => s.accounts);
  const activeAccountId = useAccountStore((s) => s.activeAccountId);
  const hydrateAccounts = useAccountStore((s) => s.hydrateAccounts);

  const switchToAccount = useAuthStore((s) => s.switchToAccount);

  useEffect(() => {
    void hydrateAccounts();
  }, [hydrateAccounts]);

  const handleSelect = async (account: AccountSummary) => {
    if (isSwitching) return;

    if (account.id === activeAccountId) {
      onSelectAccount?.(account);
      onClose();
      return;
    }

    try {
      setIsSwitching(true);

      await switchToAccount(account.id);

      useNotificationsStore.getState().setActiveAccountType(account.kind);

      onSelectAccount?.(account);
      onClose();
    } catch {
      // Later we can show a toast here if you have one.
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.handleWrap}>
        <View style={styles.handle} />
      </View>

      <View style={styles.header}>
        <AppText style={styles.headerTitle}>Switch account</AppText>

        <Pressable onPress={onClose} style={styles.closeButton} hitSlop={10}>
          <Feather name="x" size={18} color={colors.textMuted} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {accounts.map((account) => {
          const isActive = account.id === activeAccountId;
          const shouldShowHandle =
            account.kind === "personal" && !!account.handle;

          return (
            <Pressable
              key={`${account.id}-${account.kind}`}
              style={[
                styles.row,
                isActive && styles.rowActive,
                isSwitching && styles.rowDisabled,
              ]}
              disabled={isSwitching}
              onPress={() => void handleSelect(account)}
            >
              <AppAvatar
                size="md"
                name={account.displayName}
                username={shouldShowHandle ? account.handle : undefined}
                imageUrl={account.avatarUrl}
              />

              <View style={styles.rowText}>
                <AppText style={styles.rowName} numberOfLines={1}>
                  {account.displayName}
                </AppText>

                {shouldShowHandle ? (
                  <AppText style={styles.rowHandle} numberOfLines={1}>
                    @{account.handle}
                  </AppText>
                ) : null}

                <AppText style={styles.rowSubtype}>
                  {account.kind === "personal"
                    ? "Personal account"
                    : "Business account"}
                </AppText>

                {account.notificationsCount > 0 ? (
                  <AppText style={styles.notificationCount}>
                    {account.notificationsCount} new notification
                    {account.notificationsCount === 1 ? "" : "s"}
                  </AppText>
                ) : null}
              </View>

              <View style={styles.rowRight}>
                {isActive ? (
                  <View style={styles.activeBadge}>
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={colors.primaryGreen}
                    />
                  </View>
                ) : (
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.textMuted}
                  />
                )}
              </View>
            </Pressable>
          );
        })}

        <Pressable
          style={[styles.addRow, isSwitching && styles.rowDisabled]}
          disabled={isSwitching}
          onPress={() => {
            onClose();
            setTimeout(() => {
              router.push({
                pathname: '/auth/sign-in',
                params: { mode: 'add-account' },
              });
            }, 300);
          }}
        >
          <View style={styles.addIcon}>
            <Ionicons name="add" size={22} color={colors.primaryGreen} />
          </View>

          <AppText style={styles.addText}>Add account</AppText>
        </Pressable>
      </ScrollView>
    </View>
  );
}
