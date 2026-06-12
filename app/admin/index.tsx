import AppButton from "@/src/components/ui/AppButton/AppButton";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import { fetchAdminUsers, deleteAdminUser } from "@/src/features/admin/services/admin.service";
import type { AdminUser } from "@/src/features/admin/types/admin.types";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { spacing } from "@/src/constants/spacing";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ACCOUNT_TYPE_OPTIONS = [
  { label: "All", value: "" },
  { label: "Personal", value: "personal" },
  { label: "Business", value: "business" },
];

export default function AdminUsersScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
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
          setUsers((prev) => [...prev, ...data.users]);
        }
        setTotal(data.total);
        setPage(data.page);
        setTotalPages(data.totalPages);
      } catch {
        Alert.alert("Error", "Failed to load users");
      } finally {
        setIsLoading(false);
      }
    },
    [search, accountType],
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const handleDelete = (user: AdminUser) => {
    Alert.alert(
      "Delete user",
      `Delete ${user.email}? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAdminUser(user.id);
              setUsers((prev) => prev.filter((u) => u.id !== user.id));
              setTotal((t) => t - 1);
            } catch {
              Alert.alert("Error", "Failed to delete user");
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
    <AppScreen style={styles.screen}>
      <View style={styles.header}>
        <AppText style={styles.title}>Users ({total})</AppText>
        <AppButton
          title="+ Add"
          onPress={() => router.push({ pathname: "/admin/create" } as any)}
        />
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search by name, email or username..."
        placeholderTextColor={colors.textMuted}
        value={search}
        onChangeText={(v) => { setSearch(v); }}
        returnKeyType="search"
        onSubmitEditing={() => load(1)}
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

      {isLoading && page === 1 ? (
        <AppLoader />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(u) => String(u.id)}
          contentContainerStyle={styles.list}
          onEndReached={() => { if (page < totalPages) load(page + 1); }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={isLoading && page > 1 ? <AppLoader /> : null}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.rowInfo}
                onPress={() => router.push({ pathname: "/admin/[id]", params: { id: item.id } } as any)}
              >
                <AppText style={styles.rowName}>{displayName(item)}</AppText>
                <AppText style={styles.rowMeta}>
                  {item.email} · {item.accountType}
                  {item.isAdmin ? " · admin" : ""}
                  {!item.isEmailConfirmed ? " · unconfirmed" : ""}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item)}
              >
                <AppText style={styles.deleteBtnText}>Delete</AppText>
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
    screen: { flex: 1, paddingTop: spacing.xl },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    title: { fontSize: 20, fontWeight: "700", color: colors.textPrimary },
    search: {
      marginHorizontal: spacing.lg,
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