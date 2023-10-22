import { Text, View } from "react-native";

import Button from "./button";

import theme from "@/styles/theme";

type CalendarSelectorProps = {
  children: string;
  onPress: () => void;
  isActive: boolean,
  color?: string
};

const borderColor = theme.NEUTRAL[800];

const activeTextColor = theme.NEUTRAL[100];
const inactiveTextColor = theme.NEUTRAL[100];

const activeBackgroundColor = theme.NEUTRAL[900];
const inactiveBackgroundColor = theme.NEUTRAL[950];

const CalendarSelector = (props: CalendarSelectorProps) => {
  return (
    <Button
      onPress={props.onPress}
      style={{
        padding: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        flexDirection: "row",
        marginRight: 10,
        gap: 8,
        borderWidth: 1,
        borderColor,
        backgroundColor: props.isActive ? activeBackgroundColor : inactiveBackgroundColor,
      }}
    >
      {props.color && <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 6,
          backgroundColor: props.color,
        }}
      />}
      <Text
        style={{
          color:
            props.isActive ? activeTextColor : inactiveTextColor,
          fontSize: 16,
          fontWeight: "500",
        }}
      >
        {props.children}
      </Text>
    </Button>
  );
};

export default CalendarSelector;
