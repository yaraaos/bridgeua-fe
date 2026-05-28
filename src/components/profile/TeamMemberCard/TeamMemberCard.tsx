import AppAvatar from "@/src/components/ui/AppAvatar";
import AppText from "@/src/components/ui/AppText/AppText";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import type { TeamMember } from "@/src/types/team";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  member: TeamMember;
  onPressMenu: () => void;
};

export default function TeamMemberCard({ member, onPressMenu }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      <Pressable onPress={onPressMenu} hitSlop={8} style={{ paddingRight: 4 }}>
        <Ionicons name="ellipsis-vertical" size={18} color={colors.textMuted} />
      </Pressable>

      <AppAvatar
        name={`${member.firstName} ${member.lastName}`}
        imageUrl={member.photoUrl}
        size="sm"
      />

      <AppText
        style={{ fontSize: 14, fontWeight: "800", color: colors.textPrimary }}
      >
        {member.firstName} {member.lastName}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
