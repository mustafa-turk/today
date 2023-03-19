import { View, Text } from "react-native";

import Event from "@/components/event";

import { useCalendar } from "@/hooks/use-calendar";
import { getMonth, getDayDigits } from "@/utils/date";

const HomeScreen = () => {
  const { events } = useCalendar();

  return (
    <>
      <Text style={{ color: "#d4d4d4", fontWeight: "bold", fontSize: 32 }}>
        Today
      </Text>
      <Text style={{ color: "#737373", fontWeight: "bold", fontSize: 32 }}>
        {`${getMonth()} ${getDayDigits()}`}
      </Text>

      <View style={{ marginTop: 50, gap: 10 }}>
        {events?.map((event) => (
          <Event details={event} />
        ))}
      </View>
    </>
  );
};

export default HomeScreen;
