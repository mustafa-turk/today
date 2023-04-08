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
        backgroundColor: theme.GRAY[300],
        borderWidth: 1,
        borderColor: theme.GRAY[100],
        fontSize: 18,
        color: "white",
        ...style,
      }}
      placeholder={placeholder}
      placeholderTextColor='#707d8a'
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
