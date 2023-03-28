import { View, Text, TouchableOpacity } from "react-native";
import { shadeColor } from "@/utils/color";
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
        paddingHorizontal: 25,
        paddingVertical: 25,
        paddingTop: 25
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 24,
            backgroundColor: shadeColor(details.color, -12),
            marginTop: 7,
            marginRight: 8,
          }}
        />
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
          marginTop: 20,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text
            style={{
              color: colors.subText,
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            Start
          </Text>
          <Text
            style={{
              color: colors.text,
              fontWeight: "500",
              fontSize: 19,
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
              fontSize: 16,
            }}
          >
            End
          </Text>
          <Text
            style={{
              color: colors.text,
              fontWeight: "500",
              fontSize: 19,
            }}
          >
            {details.endTime}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: theme.NEUTRAL[800],
            paddingHorizontal: 20,
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "flex-end",
            opacity: 0.5
          }}
        >
          <Text
            style={{
              color: theme.NEUTRAL[100],
              fontWeight: "600",
            }}
          >
            {details.duration} mins
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Event;
