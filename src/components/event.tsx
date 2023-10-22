import { View, Text, TouchableOpacity } from "react-native";

import theme from "@/styles/theme";
import { EventType } from "@/utils/types";

type Props = {
  details: EventType;
  onPress(): void;
  disabled: boolean;
};

const Event = ({ disabled, details, onPress }: Props) => {
  const colors = {
    title: theme.NEUTRAL[100],
    text: theme.NEUTRAL[300],
    subText: theme.NEUTRAL[400],
    border: theme.NEUTRAL[800],
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={{
        margin: 20,
        paddingLeft: 20,
        paddingRight: 10,
        borderLeftWidth: 3,
        borderLeftColor: details.color,
      }}
    >
      <View>
        <View style={{ marginBottom: 2 }}>
          <Text
            style={{
              color: details.color,
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            {details.calendarTitle}
          </Text>
        </View>
        <View style={{ marginBottom: 2 }}>
          <Text
            style={{
              color: colors.title,
              fontSize: 19,
              fontWeight: "600",
            }}
          >
            {details.title}
          </Text>
        </View>
        {details.location && <Text
          style={{
            color: theme.NEUTRAL[400],
            fontSize: 17,
            fontWeight: "500",
          }}
        >
          {details.location}
        </Text>}
      </View>

      <View
        style={{
          gap: 6,
          flexDirection: "row",
          marginTop: 10
        }}
      >
        <Text style={{ color: colors.title, fontSize: 16, fontWeight: "600" }}>
          {details.startTime}
        </Text>
        <Text style={{ color: colors.title, fontSize: 16, fontWeight: "600" }}>
          -
        </Text>
        <Text style={{ color: colors.subText, fontSize: 16, fontWeight: "600" }}>
          {details.endTime}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Event;
