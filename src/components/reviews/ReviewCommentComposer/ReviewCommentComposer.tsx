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

  const canSubmit = !!text.trim();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputPill,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Add your reply..."
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.textPrimary }]}
        />

        <Pressable
          style={[
            styles.sendButton,
            {
              backgroundColor: canSubmit
                ? colors.primaryGreen
                : colors.primaryGreenSoft,
            },
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <MaterialIcons
            name="arrow-upward"
            size={18}
            color={canSubmit ? "#FFFFFF" : colors.primaryGreen}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
  },
  inputPill: {
    minHeight: 54,
    paddingLeft: 18,
    paddingRight: 8,
    borderWidth: 1,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 42,
    fontSize: 16,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
});
