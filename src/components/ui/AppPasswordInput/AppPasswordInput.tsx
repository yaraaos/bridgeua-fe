import type { TextInputProps } from "react-native";
import AppInput from "../AppInput/AppInput";

type Props = TextInputProps & {
  error?: boolean;
  disabled?: boolean;
};

export default function AppPasswordInput(props: Props) {
  return <AppInput {...props} secureTextEntry />;
}
