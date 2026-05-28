import AppAvatar from "@/src/components/ui/AppAvatar";
import AppText from "@/src/components/ui/AppText/AppText";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import type { TeamMember } from "@/src/types/team";
import { StyleSheet, View } from "react-native";

type Props = {
  member: TeamMember;
};

export default function TeamMemberCard({ member }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
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
