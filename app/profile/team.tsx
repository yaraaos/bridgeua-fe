import ScreenHeader from "@/src/components/common/ScreenHeader/ScreenHeader";
import TeamMemberCard from "@/src/components/profile/TeamMemberCard/TeamMemberCard";
import AppEmptyState from "@/src/components/ui/AppEmptyState";
import AppScreen from "@/src/components/ui/AppScreen/AppScreen";
import AppText from "@/src/components/ui/AppText/AppText";
import { AppColors } from "@/src/constants/colors";
import { spacing } from "@/src/constants/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useTeamStore } from "@/src/store/team.store";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function TeamScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { members, addMember } = useTeamStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const canSave = firstName.trim().length > 0;

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

  const handleSave = () => {
    if (!canSave) return;
    addMember({
      id: Math.random().toString(36).slice(2),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      photoUrl: photoUri,
    });
    setModalVisible(false);
    resetModal();
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

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={addCard}
        ListEmptyComponent={
          <AppEmptyState
            title="No team members yet"
            description="Add your first team member to get started."
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <Pressable>
            <TeamMemberCard member={item} />
          </Pressable>
        )}
      />

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
              onPress={handleSave}
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
    </AppScreen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
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
