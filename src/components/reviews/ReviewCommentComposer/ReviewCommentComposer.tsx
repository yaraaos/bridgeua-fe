import { useAppTheme } from "@/src/hooks/useAppTheme";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

type Props = {
  onSubmit: (text: string) => void;
};

export default function ReviewCommentComposer({ onSubmit }: Props) {
  const { colors } = useAppTheme();
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const trimmedText = text.trim();

    if (!trimmedText) return;

    onSubmit(trimmedText);
    setText("");
  };

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Add a comment..."
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { color: colors.textPrimary }]}
      />

      <Pressable
        style={[
          styles.sendButton,
          {
            backgroundColor: text.trim() ? colors.primaryGreen : colors.border,
          },
        ]}
        onPress={handleSubmit}
      >
        <MaterialIcons name="arrow-upward" size={18} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 58,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 40,
    fontSize: 14,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
