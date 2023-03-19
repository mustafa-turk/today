import { View, Text, TouchableOpacity } from "react-native";
import { shadeColor } from "@/utils/color";

const Event = ({ details, onPress }) => {
  const colors = {
    default: details.color,
    light: `${details.color}3D`,
    dark: shadeColor(details.color, -50),
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        backgroundColor: colors.light,
        padding: 20,
        borderRadius: 20,
      }}
    >
      <Text
        style={{
          color: colors.dark,
          fontSize: 24,
          fontWeight: "600",
        }}
      >
        {details.title}
      </Text>

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
              color: colors.dark,
              fontWeight: "600",
              fontSize: 21,
            }}
          >
            {details.startTime}
          </Text>
          <Text
            style={{
              color: colors.dark,
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            Start
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.light,
            paddingHorizontal: 20,
            borderRadius: 40,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: colors.dark,
              fontWeight: "600",
            }}
          >
            {details.duration} mins
          </Text>
        </View>

        <View>
          <Text
            style={{
              color: colors.dark,
              fontWeight: "600",
              fontSize: 21,
            }}
          >
            {details.endTime}
          </Text>
          <Text
            style={{
              color: colors.dark,
              fontSize: 16,
            }}
          >
            End
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Event;
