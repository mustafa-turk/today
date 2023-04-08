import { TextInput } from "react-native";

import theme from "@/styles/theme";

function CustomTextInput({ placeholder, value, onChangeText, ...props }) {
  return (
    <TextInput
      style={{
        borderRadius: 10,
        padding: 16,
        backgroundColor: theme.GRAY[300],
        fontSize: 18,
        color: "white",
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
