import { useAppTheme } from "@/src/hooks/useAppTheme";
import { MaterialIcons } from "@expo/vector-icons";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, TextInput, View } from "react-native";

const MAX_COMMENT_LENGTH = 700;

export type ReviewCommentComposerRef = {
  focus: () => void;
};

type Props = {
  onSubmit: (text: string) => void;
};

const ReviewCommentComposer = forwardRef<ReviewCommentComposerRef, Props>(
  function ReviewCommentComposer({ onSubmit }, ref) {
    const { colors } = useAppTheme();
    const [text, setText] = useState("");
    const inputRef = useRef<TextInput | null>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));
    const counterShake = useState(new Animated.Value(0))[0];

    const canSubmit = !!text.trim();

    const shakeCounter = () => {
      Animated.sequence([
        Animated.timing(counterShake, {
          toValue: -4,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(counterShake, {
          toValue: 4,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(counterShake, {
          toValue: -3,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(counterShake, {
          toValue: 3,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(counterShake, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const handleSubmit = () => {
      const trimmedText = text.trim();

      if (!trimmedText) return;

      onSubmit(trimmedText);
      setText("");
    };

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.inputPill,
            {
              backgroundColor: colors.surface,
              borderColor:
                text.length >= MAX_COMMENT_LENGTH
                  ? colors.error
                  : colors.border,
            },
          ]}
        >
          <TextInput
            ref={inputRef}
            value={text}
            multiline
            maxLength={MAX_COMMENT_LENGTH}
            scrollEnabled
            onKeyPress={({ nativeEvent }) => {
              if (
                text.length >= MAX_COMMENT_LENGTH &&
                nativeEvent.key !== "Backspace"
              ) {
                shakeCounter();
              }
            }}
            onChangeText={(nextText) => {
              if (
                nextText.length >= MAX_COMMENT_LENGTH &&
                text.length >= MAX_COMMENT_LENGTH
              ) {
                shakeCounter();
              }

              setText(nextText);
            }}
            placeholder="Add your reply..."
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { color: colors.textPrimary }]}
          />

          <Animated.Text
            style={[
              styles.counter,
              {
                color:
                  text.length >= MAX_COMMENT_LENGTH
                    ? colors.error
                    : colors.textMuted,
                transform: [{ translateX: counterShake }],
              },
            ]}
          >
            {text.length}/{MAX_COMMENT_LENGTH}
          </Animated.Text>

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
  },
);

export default ReviewCommentComposer;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
  },
  inputPill: {
    minHeight: 44,
    maxHeight: 150,
    paddingLeft: 18,
    paddingRight: 6,
    paddingTop: 4,
    paddingBottom: 4,
    borderWidth: 1,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },

  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 120,
    fontSize: 16,
    paddingTop: 7,
    paddingBottom: 7,
    textAlignVertical: "top",
  },

  counter: {
    minWidth: 54,
    height: 34,
    lineHeight: 34,
    textAlign: "right",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 2,
  },

  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
  },
});
