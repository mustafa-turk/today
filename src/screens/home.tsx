import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
} from "react-native";

import Event from "@/components/event";
import { PlusIcon } from "@/components/icon";

import { useCalendar } from "@/hooks/use-calendar";
import { getMonth, getDayDigits } from "@/utils/date";

const HomeScreen = ({ navigation }) => {
  const { events, calendars } = useCalendar();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today</Text>
      <Text style={styles.date}>{`${getMonth()} ${getDayDigits()}`}</Text>

      <TouchableHighlight activeOpacity={0.7} style={styles.button}>
        <Text style={styles.buttonIcon}>
          <PlusIcon size={24} />
        </Text>
      </TouchableHighlight>

      <View style={styles.eventsContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.eventsList}
        >
          <View style={{ gap: 16, marginBottom: 48 }}>
            {events?.map((event, key) => (
              <Event
                details={event}
                key={key}
                onPress={() =>
                  navigation.navigate("EventDetails", { event, calendars })
                }
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: { color: "#d4d4d4", fontWeight: "bold", fontSize: 32 },
  date: { color: "#737373", fontWeight: "bold", fontSize: 32 },
  button: { backgroundColor: "#171717", borderRadius: 20, marginTop: 20 },
  buttonIcon: {
    color: "#525252",
    textAlign: "center",
    padding: 20,
    fontSize: 30,
  },
  eventsContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    height: "72%",
    backgroundColor: "white",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  eventsList: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
});

export default HomeScreen;
