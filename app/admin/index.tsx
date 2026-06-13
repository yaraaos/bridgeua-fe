import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import { fetchAdminUsers, deleteAdminUser } from "@/src/features/admin/services/admin.service";
import type { AdminUser } from "@/src/features/admin/types/admin.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useAppStore } from "@/src/store/app.store";
import { spacing } from "@/src/constants/spacing";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AdminUsersScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const incrementBusinessesVersion = useAppStore((s) => s.incrementBusinessesVersion);

  const ACCOUNT_TYPE_OPTIONS = [
    { label: t("admin.users.filterAll"), value: "" },
    { label: t("admin.users.filterPersonal"), value: "personal" },
    { label: t("admin.users.filterBusiness"), value: "business" },
  ];

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [accountType, setAccountType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(
    async (p = 1) => {
      try {
        setIsLoading(true);
        const data = await fetchAdminUsers({ page: p, limit: 20, search, accountType });
        if (p === 1) {
          setUsers(data.users);
        } else {
          setUsers((prev) => {
            const seen = new Set(prev.map((u) => u.id));
            return [...prev, ...data.users.filter((u) => !seen.has(u.id))];
          });
        }
        setPage(data.page);
        setTotalPages(data.totalPages);
      } catch {
        Alert.alert(t("common.error"), t("admin.users.errorLoad"));
      } finally {
        setIsLoading(false);
      }
    },
    [search, accountType, t],
  );

  useFocusEffect(
    useCallback(() => {
      load(1);
    }, [load]),
  );

  const handleDelete = (user: AdminUser) => {
    Alert.alert(
      t("admin.users.deleteTitle"),
      t("admin.users.deleteConfirm", { email: user.email }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("admin.users.deleteButton"),
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAdminUser(user.id);
              setUsers((prev) => prev.filter((u) => u.id !== user.id));
              incrementBusinessesVersion();
            } catch (e: any) {
              Alert.alert(t("common.error"), e?.message ?? t("admin.users.errorDelete"));
            }
          },
        },
      ],
    );
  };

  const displayName = (user: AdminUser) => {
    if (user.accountType === "business") {
      return user.businesses?.[0]?.name ?? user.email;
    }
    const p = user.profile;
    if (p?.firstName || p?.lastName) {
      return [p.firstName, p.lastName].filter(Boolean).join(" ");
    }
    return user.email;
  };

  return (
    <AppScreen withTopInset={false} style={styles.screen}>
      <ScreenHeader
        title={t("admin.users.title")}
        titleSubtitle={t("admin.users.subtitle")}
        onBack={() => router.back()}
        bottomSlot={
          <AppButton
            title={t("admin.users.addNew")}
            size="sm"
            onPress={() => router.push({ pathname: "/admin/create" } as any)}
            style={styles.addButton}
          />
        }
      />

      <TextInput
        style={styles.search}
        placeholder={t("admin.users.searchPlaceholder")}
        placeholderTextColor={colors.textMuted}
        value={inputValue}
        onChangeText={(v) => {
          setInputValue(v);
          if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
          searchTimerRef.current = setTimeout(() => setSearch(v), 350);
        }}
        returnKeyType="search"
        onSubmitEditing={() => {
          if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
          setSearch(inputValue);
        }}
      />

      <View style={styles.filters}>
        {ACCOUNT_TYPE_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.filterChip, accountType === opt.value && styles.filterChipActive]}
            onPress={() => setAccountType(opt.value)}
          >
            <AppText
              style={[styles.filterChipText, accountType === opt.value && styles.filterChipTextActive]}
            >
              {opt.label}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading && users.length === 0 ? (
        <AppLoader />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(u) => String(u.id)}
          contentContainerStyle={styles.list}
          onEndReached={() => { if (page < totalPages && !isLoading) load(page + 1); }}
          onEndReachedThreshold={0.3}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          ListFooterComponent={isLoading && users.length > 0 ? <AppLoader /> : null}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.rowInfo}
                onPress={() => router.push({ pathname: "/admin/[id]", params: { id: item.id } } as any)}
              >
                <AppText style={styles.rowName}>{displayName(item)}</AppText>
                <AppText style={styles.rowMeta}>
                  {item.email} · {item.accountType}
                  {item.isAdmin ? ` · ${t("admin.users.isAdminLabel")}` : ""}
                  {!item.isEmailConfirmed ? ` · ${t("admin.users.isUnconfirmedLabel")}` : ""}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item)}
              >
                <AppText style={styles.deleteBtnText}>{t("admin.users.deleteButton")}</AppText>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </AppScreen>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    screen: { flex: 1, padding: 0 },
    addButton: { flex: 1 },
    search: {
      marginHorizontal: spacing.lg,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      color: colors.textPrimary,
      backgroundColor: colors.surface,
    },
    filters: {
      flexDirection: "row",
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    filterChip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    filterChipActive: {
      backgroundColor: colors.primaryGreen,
      borderColor: colors.primaryGreen,
    },
    filterChipText: { fontSize: 13, color: colors.textSecondary },
    filterChipTextActive: { color: colors.white },
    list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    rowInfo: { flex: 1 },
    rowName: { fontSize: 15, fontWeight: "600", color: colors.textPrimary },
    rowMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
    deleteBtn: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    deleteBtnText: { fontSize: 13, color: colors.error },
  });
