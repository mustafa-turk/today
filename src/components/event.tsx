import { View, Text, TouchableOpacity } from "react-native";

import theme from "@/styles/theme";
import { ClockIcon } from "./icon";
import { EventType } from "@/utils/types";

import translator from "@/utils/i18n";

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
        paddingHorizontal: 20,
        borderLeftWidth: 3,
        borderLeftColor: details.color,
      }}
    >
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

      <Text
        style={{
          color: theme.NEUTRAL[400],
          fontSize: 17,
          fontWeight: "500",
        }}
      >
        {details.location}
      </Text>

      <View
        style={{
          marginTop: 15,
          flexDirection: "row",
          gap: 6,
          alignItems: "center",
        }}
      >
        <ClockIcon color={colors.subText} size={14} />
        <Text style={{ color: colors.subText, fontSize: 14 }}>
          {details.isEventAllDay
            ? translator.t("full_day")
            : `${details.startTime} - ${details.endTime}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Event;
