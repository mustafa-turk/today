import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";

import Event from "@/components/event";
import { PlusIcon } from "@/components/icon";

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

      <TouchableOpacity
        style={{ backgroundColor: "#171717", borderRadius: 20, marginTop: 20 }}
      >
        <Text
          style={{
            color: "#525252",
            textAlign: "center",
            padding: 20,
            fontSize: 30,
            fontWeight: "600",
          }}
        >
          <PlusIcon size={24} />
        </Text>
      </TouchableOpacity>

      <Modal animationType='slide' transparent visible>
        <View
          style={{
            height: "64%",
            marginTop: "auto",
            backgroundColor: "#e5e5e5",
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
          }}
        >
          <ScrollView
            style={{
              paddingHorizontal: 16,
              paddingVertical: 20,
              borderTopRightRadius: 30,
              borderTopLeftRadius: 30,
            }}
          >
            <View style={{ gap: 16, paddingBottom: 48 }}>
              {events?.map((event) => (
                <Event details={event} />
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

export default HomeScreen;
