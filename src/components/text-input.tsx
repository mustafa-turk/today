import { TextInput } from "react-native";

import theme from "@/styles/theme";

function CustomTextInput({
  placeholder,
  value,
  onChangeText,
  style,
  ...props
}) {
  return (
    <TextInput
      style={{
        borderRadius: 10,
        padding: 14,
        backgroundColor: theme.NEUTRAL[900],
        borderWidth: 1,
        borderColor: theme.NEUTRAL[800],
        fontSize: 18,
        color: "white",
        ...style,
      }}
      placeholder={placeholder}
      placeholderTextColor={theme.NEUTRAL[400]}
      onChangeText={onChangeText}
      value={value}
      autoCorrect={false}
      keyboardAppearance='dark'
      autoCapitalize='none'
      autoComplete='off'
      {...props}
    />
  );
}

export default CustomTextInput;
