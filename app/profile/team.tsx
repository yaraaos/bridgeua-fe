import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import TeamMemberCard from "@/src/components/profile/TeamMemberCard/TeamMemberCard";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppLoader from "@/src/components/ui/AppLoader/AppLoader";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useMyBusinessProfile } from "@/src/features/businesses/hooks/useBusiness";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { apiClient } from "@/src/services/api/client";
import { API_BASE_URL } from "@/src/services/api/config";
import { getAccessToken } from "@/src/services/auth/tokens";
import { useTeamStore } from "@/src/store/team.store";
import type { TeamMember } from "@/src/types/team";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function TeamScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { members, addMember, removeMember, updateMember } = useTeamStore();
  const { business } = useMyBusinessProfile();
  const businessId = business?.id;

  const [modalVisible, setModalVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const canSave = firstName.trim().length > 0;

  const [openMenuMemberId, setOpenMenuMemberId] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editPhotoUrl, setEditPhotoUrl] = useState<string | undefined>(
    undefined,
  );
  const canEditSave = editFirstName.trim().length > 0;

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!businessId) return;
      setIsLoading(true);
      setFetchError(null);
      void apiClient
        .get<TeamMember[]>(`/api/businesses/${businessId}/team`)
        .then((res) => {
          useTeamStore.setState({
            members: res.data.map((m) => ({
              ...m,
              photoUrl: m.photoUrl
                ? m.photoUrl.startsWith("http")
                  ? m.photoUrl
                  : `${API_BASE_URL}${m.photoUrl}`
                : undefined,
            })),
          });
        })
        .catch(() => {
          setFetchError("Failed to load team members. Pull down to refresh.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, [businessId]),
  );

  const handleRefresh = useCallback(() => {
    if (!businessId) return;
    setRefreshing(true);
    setFetchError(null);
    void apiClient
      .get<TeamMember[]>(`/api/businesses/${businessId}/team`)
      .then((res) => {
        useTeamStore.setState({
          members: res.data.map((m) => ({
            ...m,
            photoUrl: m.photoUrl
              ? m.photoUrl.startsWith("http")
                ? m.photoUrl
                : `${API_BASE_URL}${m.photoUrl}`
              : undefined,
          })),
        });
      })
      .catch(() => {
        setFetchError("Failed to load team members. Pull down to refresh.");
      })
      .finally(() => {
        setRefreshing(false);
      });
  }, [businessId]);

  const resetModal = () => {
    setFirstName("");
    setLastName("");
    setPhotoUri(undefined);
  };

  const handleOpenModal = () => {
    resetModal();
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handlePickEditImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEditPhotoUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!canSave || !businessId) return;
    const formData = new FormData();
    formData.append("firstName", firstName.trim());
    formData.append("lastName", lastName.trim());
    if (photoUri) {
      formData.append("photo", {
        uri: photoUri,
        name: "member-photo.jpg",
        type: "image/jpeg",
      } as unknown as Blob);
    }
    try {
      const res = await apiClient.post<TeamMember>(
        `/api/businesses/${businessId}/team`,
        formData,
      );
      addMember(res.data);
      setModalVisible(false);
      resetModal();
    } catch {
      // silent
    }
  };

  const handleEditSave = async () => {
    if (!canEditSave || !editingMember || !businessId) return;
    const formData = new FormData();
    formData.append("firstName", editFirstName);
    formData.append("lastName", editLastName);
    if (editPhotoUrl && editPhotoUrl.startsWith("file://")) {
      formData.append("photo", {
        uri: editPhotoUrl,
        name: "member-photo.jpg",
        type: "image/jpeg",
      } as unknown as Blob);
    }
    try {
      const token = await getAccessToken();
      const res = await fetch(
        `${API_BASE_URL}/api/businesses/${businessId}/team/${editingMember.id}`,
        {
          method: "PUT",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        },
      );
      if (!res.ok) throw new Error("Failed");
      updateMember(editingMember.id, {
        firstName: editFirstName.trim(),
        lastName: editLastName.trim(),
        photoUrl: editPhotoUrl,
      });
      setEditingMember(null);
    } catch {
      Alert.alert("Error", "Failed to update team member. Please try again.");
    }
  };

  const handleDeleteMember = async (member: TeamMember) => {
    if (!businessId) return;
    try {
      const token = await getAccessToken();
      const res = await fetch(
        `${API_BASE_URL}/api/businesses/${businessId}/team/${member.id}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      if (!res.ok) throw new Error("Failed");
      removeMember(member.id);
    } catch {
      Alert.alert("Error", "Failed to delete team member. Please try again.");
    }
  };

  const addCard = (
    <Pressable style={styles.addCard} onPress={handleOpenModal}>
      <View style={styles.addIconCircle}>
        <Ionicons name="add" size={22} color={colors.primaryGreen} />
      </View>
      <AppText style={styles.addText}>Add team member</AppText>
    </Pressable>
  );

  return (
    <AppScreen withTopInset={false} style={{ padding: 0 }}>
      <ScreenHeader
        title="My Team"
        titleSubtitle="Manage your business team members."
        onBack={() => router.back()}
      />

      {isLoading ? (
        <View style={styles.centerState}>
          <AppLoader />
        </View>
      ) : (
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={addCard}
        ListEmptyComponent={
          fetchError ? (
            <AppText style={styles.errorText}>{fetchError}</AppText>
          ) : (
            <AppEmptyState
              title="No team members yet"
              description="Add your first team member to get started."
            />
          )
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => (
          <View>
            <TeamMemberCard
              member={item}
              onPressMenu={() =>
                setOpenMenuMemberId((prev) =>
                  prev === item.id ? null : item.id,
                )
              }
            />
            {openMenuMemberId === item.id && (
              <View style={styles.inlineMenu}>
                <Pressable
                  style={styles.inlineMenuRow}
                  onPress={() => {
                    setOpenMenuMemberId(null);
                    setEditingMember(item);
                    setEditFirstName(item.firstName);
                    setEditLastName(item.lastName);
                    setEditPhotoUrl(item.photoUrl);
                  }}
                >
                  <Ionicons
                    name="create-outline"
                    size={16}
                    color={colors.textPrimary}
                  />
                  <AppText
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: colors.textPrimary,
                    }}
                  >
                    Edit
                  </AppText>
                </Pressable>
                <View style={{ height: 1, backgroundColor: colors.border }} />
                <Pressable
                  style={styles.inlineMenuRow}
                  onPress={() => {
                    setOpenMenuMemberId(null);
                    Alert.alert(
                      "Delete team member",
                      `Are you sure you want to delete ${item.firstName} ${item.lastName}?`,
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => void handleDeleteMember(item),
                        },
                      ],
                    );
                  }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={16}
                    color={colors.error}
                  />
                  <AppText
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: colors.error,
                    }}
                  >
                    Delete
                  </AppText>
                </Pressable>
              </View>
            )}
          </View>
        )}
      />
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <AppText style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Add team member
            </AppText>

            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.modalInput,
                {
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  backgroundColor: colors.background,
                },
              ]}
            />

            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.modalInput,
                {
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  backgroundColor: colors.background,
                },
              ]}
            />

            <Pressable style={styles.photoRow} onPress={handlePickImage}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              ) : (
                <Ionicons
                  name="camera-outline"
                  size={18}
                  color={colors.textSecondary}
                />
              )}
              <AppText
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.textSecondary,
                }}
              >
                Add a profile picture
              </AppText>
            </Pressable>

            <Pressable
              style={[
                styles.saveButton,
                {
                  backgroundColor: colors.primaryGreen,
                  opacity: canSave ? 1 : 0.5,
                },
              ]}
              onPress={() => void handleSave()}
              disabled={!canSave}
            >
              <AppText style={styles.saveButtonText}>Save</AppText>
            </Pressable>

            <Pressable style={styles.cancelButton} onPress={handleCloseModal}>
              <AppText
                style={[
                  styles.cancelButtonText,
                  { color: colors.textSecondary },
                ]}
              >
                Cancel
              </AppText>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={editingMember !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingMember(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <AppText style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Edit team member
            </AppText>

            <TextInput
              value={editFirstName}
              onChangeText={setEditFirstName}
              placeholder="First name"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.modalInput,
                {
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  backgroundColor: colors.background,
                },
              ]}
            />

            <TextInput
              value={editLastName}
              onChangeText={setEditLastName}
              placeholder="Last name"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.modalInput,
                {
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  backgroundColor: colors.background,
                },
              ]}
            />

            <Pressable style={styles.photoRow} onPress={handlePickEditImage}>
              {editPhotoUrl ? (
                <Image
                  source={{ uri: editPhotoUrl }}
                  style={styles.photoPreview}
                />
              ) : (
                <Ionicons
                  name="camera-outline"
                  size={18}
                  color={colors.textSecondary}
                />
              )}
              <AppText
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.textSecondary,
                }}
              >
                Add photo
              </AppText>
            </Pressable>

            <Pressable
              style={[
                styles.saveButton,
                {
                  backgroundColor: colors.primaryGreen,
                  opacity: canEditSave ? 1 : 0.5,
                },
              ]}
              onPress={() => void handleEditSave()}
              disabled={!canEditSave}
            >
              <AppText style={styles.saveButtonText}>Save</AppText>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => setEditingMember(null)}
            >
              <AppText
                style={[
                  styles.cancelButtonText,
                  { color: colors.textSecondary },
                ]}
              >
                Cancel
              </AppText>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    centerState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      textAlign: "center",
      paddingHorizontal: 24,
    },
    listContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 24,
    },
    addCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: spacing.md,
      marginBottom: 12,
    },
    addIconCircle: {
      width: 40,
      height: 40,
      borderRadius: 999,
      borderWidth: 1.5,
      borderStyle: "dashed",
      borderColor: colors.primaryGreen,
      alignItems: "center",
      justifyContent: "center",
    },
    addText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.primaryGreen,
    },
    separator: {
      height: 12,
    },
    inlineMenu: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      marginTop: -8,
      overflow: "hidden",
    },
    inlineMenuRow: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.35)",
    },
    modalCard: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 32,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "800",
    },
    modalInput: {
      minHeight: 48,
      marginTop: 14,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderRadius: 16,
      fontSize: 14,
    },
    photoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 14,
    },
    photoPreview: {
      width: 56,
      height: 56,
      borderRadius: 12,
    },
    saveButton: {
      height: 48,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },
    saveButtonText: {
      fontSize: 14,
      fontWeight: "800",
      color: "#FFFFFF",
    },
    cancelButton: {
      alignSelf: "center",
      paddingVertical: 12,
    },
    cancelButtonText: {
      fontSize: 14,
      fontWeight: "700",
    },
  });
}
