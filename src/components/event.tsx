import { View, Text } from "react-native";
import { shadeColor } from "@/utils/color";

const Event = ({ details }) => {
  return (
    <View
      style={{
        backgroundColor: shadeColor(details.color, -90),
        padding: 20,
        borderRadius: 12,
      }}
    >
      <Text style={{ color: details.color, fontSize: 24, fontWeight: "600" }}>
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
              color: details.color,
              fontWeight: "600",
              fontSize: 21,
            }}
          >
            {details.startTime}
          </Text>
          <Text
            style={{
              color: details.color,
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            Start
          </Text>
        </View>

        <View
          style={{
            backgroundColor: details.color,
            paddingHorizontal: 20,
            borderRadius: 40,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: shadeColor(details.color, -90),
              fontWeight: "600",
            }}
          >
            {details.duration} mins
          </Text>
        </View>

        <View>
          <Text
            style={{
              color: details.color,
              fontWeight: "600",
              fontSize: 21,
            }}
          >
            {details.endTime}
          </Text>
          <Text
            style={{
              color: details.color,
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            End
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Event;
