import { View, Text, TouchableOpacity } from "react-native";

import theme from "@/styles/theme";

const Event = ({ details, onPress }) => {
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
      style={{
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        padding: 20,
        paddingHorizontal: 25
      }}
    >
      <View style={{ flexDirection: "row", alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <View style={{ backgroundColor: details.color, width: 15, height: 15, borderRadius: 10 }} />
        <Text
          style={{
            color: colors.subText,
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          {details.calendarTitle}
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            color: colors.title,
            fontSize: 21,
            fontWeight: "600",
          }}
        >
          {details.title}
        </Text>
      </View>

      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          gap: 30
        }}
      >
        <View>
          <Text
            style={{
              color: colors.subText,
              fontWeight: "600",
              fontSize: 14,
            }}
          >
            Start
          </Text>
          <Text
            style={{
              color: colors.text,
              fontWeight: "500",
              fontSize: 16,
            }}
          >
            {details.startTime}
          </Text>
        </View>

        <View>
          <Text
            style={{
              color: colors.subText,
              fontWeight: "600",
              fontSize: 14,
            }}
          >
            End
          </Text>
          <Text
            style={{
              color: colors.text,
              fontWeight: "500",
              fontSize: 16,
            }}
          >
            {details.endTime}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Event;
