import { TouchableOpacity, ViewStyle } from "react-native";

type ButtonProps = {
  children: JSX.Element | JSX.Element[] | string,
  onPress: () => void,
  style: ViewStyle
}

const Button = (props: ButtonProps) => {
  return (
    <TouchableOpacity activeOpacity={0.7} {...props}>
      {props.children}
    </TouchableOpacity>
  )
}

export default Button;
